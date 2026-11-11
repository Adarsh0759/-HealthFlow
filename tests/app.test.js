
const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const server = require("../src/server");

let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  return {
    status: response.status,
    body: await response.json()
  };
}

test("HealthFlow API returns application information", async () => {
  const result = await get("/");
  assert.strictEqual(result.status, 200);
  assert.strictEqual(result.body.application, "HealthFlow");
});

test("Health endpoint returns healthy status", async () => {
  const result = await get("/health");
  assert.strictEqual(result.status, 200);
  assert.strictEqual(result.body.status, "healthy");
});

test("Patients endpoint returns patient records", async () => {
  const result = await get("/api/patients");
  assert.strictEqual(result.status, 200);
  assert.ok(Array.isArray(result.body));
  assert.strictEqual(result.body.length, 2);
});

test("Doctors endpoint returns doctor records", async () => {
  const result = await get("/api/doctors");
  assert.strictEqual(result.status, 200);
  assert.ok(Array.isArray(result.body));
});

test("Unknown routes return 404", async () => {
  const result = await get("/unknown");
  assert.strictEqual(result.status, 404);
});
