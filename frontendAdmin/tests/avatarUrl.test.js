import assert from "node:assert/strict";
import test from "node:test";
import { getAvatarUrl } from "../src/utils/avatarUrl.js";

test("converts root-relative upload paths to the backend URL", () => {
  assert.equal(
    getAvatarUrl("/uploads/avatar.png", "http://localhost:5000"),
    "http://localhost:5000/uploads/avatar.png"
  );
});

test("preserves absolute avatar URLs", () => {
  assert.equal(
    getAvatarUrl("https://cdn.example.com/avatar.png", "http://localhost:5000"),
    "https://cdn.example.com/avatar.png"
  );
});
