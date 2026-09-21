import assert from "node:assert/strict";
import test from "node:test";
import { ensureAccess } from "./cloudflare-access.mjs";

const ENV = {
  CLOUDFLARE_ACCOUNT_ID: "account-1",
  CLOUDFLARE_API_TOKEN: "secret-token",
  CLOUDFLARE_PAGES_PROJECT: "phi-docs",
  ACCESS_APP_DOMAIN: "docs.example.com",
  ACCESS_APP_NAME: "phi documentation",
  ACCESS_ALLOWED_EMAIL_DOMAIN: "example.com",
  ACCESS_ALLOWED_EMAILS: "maintainer@example.net",
  ACCESS_POLICY_NAME: "phi documentation allow",
};

function cloudflareResponse(result) {
  return new Response(JSON.stringify({ success: true, errors: [], result }));
}

test("creates an Access app and allow policy for every Phi Pages domain", async () => {
  const requests = [];
  const fetchFn = async (url, init = {}) => {
    const parsed = new URL(url);
    requests.push({ init, url: parsed });
    if (parsed.pathname.endsWith("/identity_providers")) {
      return cloudflareResponse([{ id: "otp-1", type: "onetimepin" }]);
    }
    if (parsed.pathname.endsWith("/access/apps") && !init.method) {
      return cloudflareResponse([]);
    }
    if (parsed.pathname.endsWith("/access/apps") && init.method === "POST") {
      return cloudflareResponse({ id: "app-1" });
    }
    if (parsed.pathname.endsWith("/policies") && !init.method) {
      return cloudflareResponse([]);
    }
    if (parsed.pathname.endsWith("/policies") && init.method === "POST") {
      return cloudflareResponse({ id: "policy-1" });
    }
    throw new Error(`Unexpected request: ${init.method ?? "GET"} ${parsed}`);
  };

  await ensureAccess({ env: ENV, fetchFn, logger: { log() {} } });

  const appRequest = requests.find(
    ({ init, url }) => url.pathname.endsWith("/access/apps") && init.method === "POST",
  );
  assert.deepEqual(JSON.parse(appRequest.init.body), {
    name: "phi documentation",
    type: "self_hosted",
    domain: "docs.example.com",
    self_hosted_domains: [
      "docs.example.com",
      "phi-docs.pages.dev",
      "*.phi-docs.pages.dev",
    ],
    session_duration: "730h",
  });

  const policyRequest = requests.find(
    ({ init, url }) => url.pathname.endsWith("/policies") && init.method === "POST",
  );
  assert.deepEqual(JSON.parse(policyRequest.init.body), {
    name: "phi documentation allow",
    decision: "allow",
    include: [
      { email_domain: { domain: "example.com" } },
      { email: { email: "maintainer@example.net" } },
    ],
    precedence: 1,
  });
});
