import assert from "node:assert/strict";
import test from "node:test";
import { getAvatarUrl } from "../src/lib/avatarUrl.js";

test("converts root-relative upload paths to the backend URL", () => {
  assert.equal(
    getAvatarUrl("/uploads/avatar.png", "http://localhost:5000"),
    "http://localhost:5000/uploads/avatar.png"
  );
});

test("converts relative paths without adding a duplicate slash", () => {
  assert.equal(
    getAvatarUrl("uploads/avatar.png", "https://api.example.com/"),
    "https://api.example.com/uploads/avatar.png"
  );
});

test("preserves absolute and protocol-relative URLs", () => {
  assert.equal(
    getAvatarUrl("https://cdn.example.com/avatar.png", "http://localhost:5000"),
    "https://cdn.example.com/avatar.png"
  );
  assert.equal(
    getAvatarUrl("//cdn.example.com/avatar.png", "http://localhost:5000"),
    "//cdn.example.com/avatar.png"
  );
});

test("returns empty values unchanged", () => {
  assert.equal(getAvatarUrl(null, "http://localhost:5000"), null);
  assert.equal(getAvatarUrl("", "http://localhost:5000"), "");
});
