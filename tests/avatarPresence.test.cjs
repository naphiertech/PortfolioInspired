const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const typescript = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../src/lib/avatarGenerator.ts"), "utf8");
const compiled = typescript.transpileModule(source, {
  compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2020 },
}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject });
const { normalizeVisitorPresence, getDiceBearAvatar } = exportsObject;

test("presence avatars ignore untrusted URLs and fallback text", () => {
  for (const name of ["Windows", "Mac", "Mobile", "Linux"]) {
    const result = normalizeVisitorPresence({
      name, variantIndex: 3, src: "https://attacker.example/track", fallback: "<untrusted>",
    });
    assert.equal(result.src, getDiceBearAvatar(name, 3));
    assert.equal(result.fallback, name.slice(0, 2).toUpperCase());
  }
});

test("presence avatars reject malformed names and bound variants", () => {
  for (const value of [null, "text", {}, { name: "<img>" }, { name: { toString: "Windows" } }]) {
    assert.equal(normalizeVisitorPresence(value), null);
  }
  for (const variantIndex of [-1, 8, 1.5, "2", null]) {
    assert.equal(normalizeVisitorPresence({ name: "Mac", variantIndex }).variantIndex, 0);
  }
});
