import assert from "node:assert/strict";
import { test } from "node:test";
import { cn } from "./cn.ts";

test("cn flattens conditional class values", () => {
  assert.equal(cn("base", false, null, undefined, { active: true, disabled: false }), "base active");
  assert.equal(cn(["flex", ["gap-2", "gap-4"]]), "flex gap-4");
});

test("cn merges common Tailwind utility conflicts", () => {
  assert.equal(cn("p-2", "p-4"), "p-4");
  assert.equal(cn("px-2 py-1", "px-4"), "py-1 px-4");
  assert.equal(cn("text-phi-default", "text-phi-subtle"), "text-phi-subtle");
  assert.equal(cn("bg-phi-base", "bg-phi-elevated"), "bg-phi-elevated");
  assert.equal(cn("border-phi-line", "border-phi-strong"), "border-phi-strong");
  assert.equal(cn("hover:bg-phi-base", "hover:bg-phi-elevated"), "hover:bg-phi-elevated");
  assert.equal(cn("sm:p-2", "sm:p-4", "md:p-6"), "sm:p-4 md:p-6");
  assert.equal(cn("data-[state=open]:bg-phi-base", "data-[state=open]:bg-phi-elevated"), "data-[state=open]:bg-phi-elevated");
  assert.equal(cn("rounded-[10px]", "rounded-[12px]"), "rounded-[12px]");
});

test("cn keeps important and non-important utilities separate", () => {
  assert.equal(cn("!p-2", "p-4"), "!p-2 p-4");
  assert.equal(cn("p-2", "!p-4"), "p-2 !p-4");
});
