import assert from "node:assert/strict";
import test from "node:test";
import { getUploadedAvatarUrl } from "../utils/avatarUrl.js";
import { uploadsDirectory } from "../config/uploadStorage.js";
import path from "path";
import { fileURLToPath } from "url";

test("creates an absolute local avatar URL by default", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "development";
    assert.equal(
      getUploadedAvatarUrl("avatar.png", ""),
      "http://localhost:5000/uploads/avatar.png"
    );
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }
});

test("requires BACKEND_URL instead of using localhost in production", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "production";
    assert.throws(
      () => getUploadedAvatarUrl("avatar.png", ""),
      /BACKEND_URL must be configured in production/
    );
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }
});

test("uses BACKEND_URL and removes trailing slashes", () => {
  assert.equal(
    getUploadedAvatarUrl("avatar.png", "https://api.example.com///"),
    "https://api.example.com/uploads/avatar.png"
  );
});

test("encodes uploaded filenames as URL path segments", () => {
  assert.equal(
    getUploadedAvatarUrl("avatar photo.png", "http://localhost:5000"),
    "http://localhost:5000/uploads/avatar%20photo.png"
  );
});

test("resolves uploads from the backend directory regardless of cwd", () => {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  assert.equal(uploadsDirectory, path.resolve(currentDirectory, "../uploads"));
});
