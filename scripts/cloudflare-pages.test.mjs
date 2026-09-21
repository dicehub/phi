import assert from "node:assert/strict";
import test from "node:test";
import {
  connectPagesDomain,
  ensurePagesDomain,
  ensurePagesProject,
  verifyPagesDeployment,
  waitForPagesDomain,
} from "./cloudflare-pages.mjs";

const ENV = {
  CLOUDFLARE_ACCOUNT_ID: "account-1",
  CLOUDFLARE_API_TOKEN: "secret-token",
  CLOUDFLARE_PAGES_BRANCH: "dev",
  CLOUDFLARE_PAGES_DOMAIN: "docs.example.com",
  CLOUDFLARE_PAGES_PROJECT: "phi-docs",
};

function cloudflareResponse(result, status = 200) {
  return new Response(
    JSON.stringify({
      success: status >= 200 && status < 300,
      errors: status >= 400 ? [{ message: "not found" }] : [],
      result,
    }),
    { status },
  );
}

const quietLogger = { log() {} };

test("creates the Pages project with dev as its production branch", async () => {
  const requests = [];
  const fetchFn = async (url, init = {}) => {
    requests.push({ init, url: String(url) });
    if (!init.method) return cloudflareResponse(undefined, 404);
    return cloudflareResponse({ subdomain: "phi-docs.pages.dev" });
  };

  const result = await ensurePagesProject({ env: ENV, fetchFn, logger: quietLogger });

  assert.equal(result.created, true);
  assert.equal(requests.length, 2);
  assert.deepEqual(JSON.parse(requests[1].init.body), {
    name: "phi-docs",
    production_branch: "dev",
  });
});

test("verifies the successful production deployment for the configured branch", async () => {
  const deployment = {
    aliases: ["phi-docs.pages.dev"],
    deployment_trigger: { metadata: { branch: "dev" } },
    latest_stage: { status: "success" },
    url: "https://deployment.phi-docs.pages.dev",
  };
  const fetchFn = async () => cloudflareResponse([deployment]);

  const result = await verifyPagesDeployment({ env: ENV, fetchFn, logger: quietLogger });

  assert.deepEqual(result, deployment);
});

test("adds the custom domain when it is not connected yet", async () => {
  const requests = [];
  const fetchFn = async (url, init = {}) => {
    requests.push({ init, url: String(url) });
    if (!init.method) return cloudflareResponse(undefined, 404);
    return cloudflareResponse({ name: ENV.CLOUDFLARE_PAGES_DOMAIN, status: "pending" });
  };

  const result = await ensurePagesDomain({ env: ENV, fetchFn, logger: quietLogger });

  assert.equal(result.created, true);
  assert.deepEqual(JSON.parse(requests[1].init.body), {
    name: ENV.CLOUDFLARE_PAGES_DOMAIN,
  });
});

test("waits for the custom domain to become active", async () => {
  const statuses = ["pending", "active"];
  let sleeps = 0;
  const fetchFn = async () => cloudflareResponse({
    name: ENV.CLOUDFLARE_PAGES_DOMAIN,
    status: statuses.shift(),
    validation_data: { status: statuses.length === 0 ? "active" : "pending" },
    verification_data: { status: "active" },
  });

  const result = await waitForPagesDomain({
    env: ENV,
    fetchFn,
    logger: quietLogger,
    pollIntervalMs: 1,
    timeoutMs: 2,
    waitFn: async () => {
      sleeps += 1;
    },
  });

  assert.deepEqual(result, { domain: ENV.CLOUDFLARE_PAGES_DOMAIN, status: "active" });
  assert.equal(sleeps, 1);
});

test("creates the proxied Pages CNAME in the parent Cloudflare zone", async () => {
  const requests = [];
  const fetchFn = async (url, init = {}) => {
    const parsed = new URL(url);
    requests.push({ init, url: parsed });
    if (parsed.pathname === "/client/v4/zones") {
      const result = parsed.searchParams.get("name") === "example.com"
        ? [{ id: "zone-1" }]
        : [];
      return cloudflareResponse(result);
    }
    if (!init.method) return cloudflareResponse([]);
    return cloudflareResponse({ id: "record-1" });
  };

  const result = await connectPagesDomain({ env: ENV, fetchFn, logger: quietLogger });

  assert.equal(result.action, "created");
  const createRequest = requests.find(({ init }) => init.method === "POST");
  assert.deepEqual(JSON.parse(createRequest.init.body), {
    type: "CNAME",
    name: "docs.example.com",
    content: "phi-docs.pages.dev",
    proxied: true,
    ttl: 1,
    comment: "Managed by the Phi documentation deployment",
  });
});

test("refuses to replace ambiguous DNS routing records", async () => {
  const fetchFn = async (url) => {
    const parsed = new URL(url);
    if (parsed.pathname === "/client/v4/zones") {
      return cloudflareResponse(
        parsed.searchParams.get("name") === "example.com" ? [{ id: "zone-1" }] : [],
      );
    }
    return cloudflareResponse([
      { name: "docs.example.com", type: "A", content: "192.0.2.1" },
      { name: "docs.example.com", type: "AAAA", content: "2001:db8::1" },
    ]);
  };

  await assert.rejects(
    connectPagesDomain({ env: ENV, fetchFn, logger: quietLogger }),
    /ambiguous/u,
  );
});
