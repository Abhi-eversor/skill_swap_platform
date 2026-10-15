const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Swap = require('../models/swap.model');
const app = require('../app');
const { validateEnvironment } = require('../config/env');

const ids = {
  alice: 'a00000000000000000000001',
  bob: 'b00000000000000000000002',
  private: 'c00000000000000000000003',
  outsider: 'd00000000000000000000004',
  swap: '200000000000000000000001',
};
const secret = 'a-test-secret-with-at-least-thirty-two-characters';
let server;
let baseUrl;
let passwordHash;
let users;
let swaps;
let nextId;

function matches(record, filter) {
  return Object.entries(filter).every(([field, expected]) => {
    if (field === '$or') return expected.some((part) => matches(record, part));
    if (expected && expected.$regex !== undefined) {
      const pattern = new RegExp(expected.$regex, expected.$options);
      const values = Array.isArray(record[field]) ? record[field] : [record[field]];
      return values.some((value) => pattern.test(value));
    }
    return String(record[field]) === String(expected);
  });
}

function withParticipants(swap) {
  if (!swap) return null;
  return {
    ...swap,
    requester: users.get(String(swap.requester)) || null,
    responder: users.get(String(swap.responder)) || null,
  };
}

function query(operation) {
  let populated = false;
  let limit = Infinity;
  const result = {
    select() { return result; },
    sort() { return result; },
    limit(value) { limit = value; return result; },
    populate() { populated = true; return result; },
    then(resolve, reject) {
      return Promise.resolve().then(operation).then((value) => {
        if (Array.isArray(value)) {
          const rows = value.slice(0, limit);
          return populated ? rows.map(withParticipants) : rows;
        }
        return populated ? withParticipants(value) : value;
      }).then(resolve, reject);
    },
  };
  return result;
}

function token(id, options = {}) {
  return jwt.sign({ id }, secret, { expiresIn: '1h', ...options });
}

async function request(path, { method = 'GET', body, as, authorization, origin } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (as) headers.Authorization = `Bearer ${token(as)}`;
  if (authorization) headers.Authorization = authorization;
  if (origin) headers.Origin = origin;
  const response = await fetch(`${baseUrl}${path}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json(), headers: response.headers };
}

before(async () => {
  process.env.JWT_SECRET = secret;
  process.env.FRONTEND_URL = 'http://localhost:5173';
  passwordHash = await bcrypt.hash('correct-password', 4);
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve, reject) => {
  server.close((error) => error ? reject(error) : resolve());
  server.closeAllConnections();
}));

beforeEach((t) => {
  nextId = 10;
  users = new Map([
    [ids.alice, { _id: ids.alice, name: 'Alice', email: 'alice@example.com',
      password: passwordHash, skillsOffered: ['React'], skillsWanted: ['Python'],
      availability: ['Weekends'], isPublic: true }],
    [ids.bob, { _id: ids.bob, name: 'Bob', email: 'bob@example.com',
      password: passwordHash, skillsOffered: ['Python'], skillsWanted: ['React'],
      availability: ['Evenings'], isPublic: true }],
    [ids.private, { _id: ids.private, name: 'Private', email: 'private@example.com',
      password: passwordHash, skillsOffered: ['Drawing'], isPublic: false }],
    [ids.outsider, { _id: ids.outsider, name: 'Outsider', email: 'outsider@example.com',
      password: passwordHash, skillsOffered: ['French'], isPublic: true }],
  ]);
  swaps = new Map([[ids.swap, { _id: ids.swap, requester: ids.alice, responder: ids.bob,
    skillOffered: 'React', skillRequested: 'Python', message: 'Saturday?', status: 'pending' }]]);
  t.mock.method(User, 'findById', (id) => query(() => users.get(String(id).toLowerCase()) || null));
  t.mock.method(User, 'findOne', (filter) => query(() => [...users.values()]
    .find((user) => matches(user, filter)) || null));
  t.mock.method(User, 'find', (filter) => query(() => [...users.values()]
    .filter((user) => matches(user, filter))));
  t.mock.method(User, 'create', async (fields) => {
    const user = new User({ ...fields, _id: `1000000000000000000000${nextId++}` });
    await user.validate();
    const record = user.toObject();
    users.set(String(record._id), record);
    return record;
  });
  t.mock.method(User, 'findByIdAndUpdate', (id, update) => query(() => {
    const current = users.get(String(id));
    if (!current) return null;
    const updated = { ...current, ...update.$set };
    users.set(String(id), updated);
    return updated;
  }));
  t.mock.method(Swap, 'find', (filter) => query(() => [...swaps.values()]
    .filter((swap) => matches(swap, filter))));
  t.mock.method(Swap, 'findById', (id) => query(() => swaps.get(String(id)) || null));
  t.mock.method(Swap, 'create', async (fields) => {
    const model = new Swap({ ...fields, _id: `2000000000000000000000${nextId++}` });
    await model.validate();
    const record = model.toObject();
    swaps.set(String(record._id), record);
    return {
      ...record,
      async populate() { Object.assign(this, withParticipants(record)); return this; },
    };
  });
  t.mock.method(Swap, 'findOneAndUpdate', (filter, update) => query(() => {
    const current = [...swaps.values()].find((swap) => matches(swap, filter));
    if (!current) return null;
    const updated = { ...current, ...update.$set };
    swaps.set(String(current._id), updated);
    return updated;
  }));
});

test('registration normalizes email, hashes passwords and returns the complete safe profile', async () => {
  const response = await request('/api/user/register', { method: 'POST', body: {
    name: '  New Member  ', email: ' NEW@EXAMPLE.COM ', password: 'secure-password',
    skillsOffered: ['React', ' react '], skillsWanted: ['Python'], isPublic: false,
  } });
  assert.equal(response.status, 201);
  assert.equal(response.body.user.name, 'New Member');
  assert.equal(response.body.user.email, 'new@example.com');
  assert.deepEqual(response.body.user.skillsOffered, ['React']);
  assert.deepEqual(response.body.user.availability, []);
  assert.equal(response.body.user.isPublic, false);
  assert.equal(response.body.user.password, undefined);
  assert.equal(jwt.verify(response.body.token, secret).id, response.body.user.id);
  assert.equal(await bcrypt.compare('secure-password', users.get(response.body.user.id).password), true);
});

test('registration rejects duplicates, missing names, malformed lists and bcrypt truncation', async () => {
  const valid = { name: 'Member', email: 'new@example.com', password: 'secure-password' };
  for (const body of [
    { ...valid, name: '' }, { ...valid, skillsOffered: 'React' },
    { ...valid, password: 'x'.repeat(73) }, { ...valid, password: '😀'.repeat(19) },
    { ...valid, isPublic: 'true' }, { ...valid, skillsWanted: [{}] },
    { ...valid, profilePhoto: 'javascript:alert(1)' }, { ...valid, admin: true },
  ]) {
    const response = await request('/api/user/register', { method: 'POST', body });
    assert.equal(response.status, 400);
    assert.equal(typeof response.body.message, 'string');
  }
  const duplicate = await request('/api/user/register', {
    method: 'POST', body: { ...valid, email: ' ALICE@EXAMPLE.COM ' },
  });
  assert.equal(duplicate.status, 409);
});

test('login accepts normalized email and rejects invalid credentials without exposing the hash', async () => {
  const valid = await request('/api/user/login', { method: 'POST', body: {
    email: ' ALICE@EXAMPLE.COM ', password: 'correct-password',
  } });
  assert.equal(valid.status, 200);
  assert.equal(valid.body.user.id, ids.alice);
  assert.equal(valid.body.user.password, undefined);
  assert.deepEqual(valid.body.user.skillsOffered, ['React']);
  for (const body of [
    { email: 'alice@example.com', password: 'wrong-password' },
    { email: 'missing@example.com', password: 'wrong-password' },
  ]) {
    assert.equal((await request('/api/user/login', { method: 'POST', body })).status, 401);
  }
});

test('protected routes parse Bearer tokens and reject expired or malformed sessions', async () => {
  const valid = await request('/api/user/me', { as: ids.alice });
  assert.equal(valid.status, 200);
  assert.equal(valid.body.user.email, 'alice@example.com');
  assert.equal(valid.body.user.password, undefined);
  for (const authorization of [token(ids.alice), 'Bearer invalid',
    `Bearer ${token(ids.alice, { expiresIn: '-1s' })}`]) {
    assert.equal((await request('/api/user/me', { authorization })).status, 401);
  }
  assert.equal((await request('/api/user/me')).status, 401);
  assert.equal((await request('/api/user/me', { as: '100000000000000000000099' })).status, 401);
});

test('legacy mixed-case email accounts can sign in and cannot be registered again', async () => {
  users.get(ids.alice).email = 'Alice@Example.com';
  const login = await request('/api/user/login', { method: 'POST', body: {
    email: ' ALICE@EXAMPLE.COM ', password: 'correct-password',
  } });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.id, ids.alice);
  const duplicate = await request('/api/user/register', { method: 'POST', body: {
    name: 'Duplicate', email: 'alice@example.com', password: 'secure-password',
  } });
  assert.equal(duplicate.status, 409);
});

test('public directory searches safely and excludes private profiles and contact details', async () => {
  const all = await request('/api/users');
  assert.equal(all.status, 200);
  assert.equal(all.body.users.length, 3);
  assert.equal(all.body.users.some((user) => user.id === ids.private), false);
  assert.equal(all.body.users.some((user) => user.email || user.password), false);
  const filtered = await request('/api/users?q=react&availability=weekends');
  assert.deepEqual(filtered.body.users.map((user) => user.id), [ids.alice]);
  assert.deepEqual((await request('/api/users?q=.*')).body.users, []);
});

test('private profiles are visible only to their owner', async () => {
  assert.equal((await request(`/api/users/${ids.private}`)).status, 404);
  assert.equal((await request(`/api/users/${ids.private}`, { as: ids.alice })).status, 404);
  const own = await request(`/api/users/${ids.private}`, { as: ids.private });
  assert.equal(own.status, 200);
  assert.equal(own.body.user.email, 'private@example.com');
  assert.equal((await request(`/api/users/${ids.private.toUpperCase()}`, { as: ids.private })).status, 200);
  const publicProfile = await request(`/api/users/${ids.bob}`, { as: ids.alice });
  assert.equal(publicProfile.body.user.email, undefined);
  assert.equal((await request('/api/users/not-an-id')).status, 400);
});

test('profile updates are restricted to the signed-in user and permitted fields', async () => {
  const response = await request('/api/user/me', { method: 'PATCH', as: ids.alice,
    body: { name: 'Alice Updated', skillsOffered: ['React', 'Python'], isPublic: false } });
  assert.equal(response.status, 200);
  assert.equal(users.get(ids.alice).name, 'Alice Updated');
  assert.equal(users.get(ids.bob).name, 'Bob');
  assert.equal((await request('/api/user/me', { method: 'PATCH', as: ids.alice,
    body: { email: 'bob@example.com' } })).status, 400);
  assert.equal((await request('/api/user/me', { method: 'PATCH', as: ids.alice,
    body: { profilePhoto: 'data:image/svg+xml,bad' } })).status, 400);
});

test('swap creation checks both skill owners and stores the message', async () => {
  const response = await request('/api/swaps', { method: 'POST', as: ids.alice, body: {
    responder: ids.bob, skillOffered: 'react', skillRequested: 'Python', message: ' Saturday? ',
  } });
  assert.equal(response.status, 201);
  assert.equal(response.body.swap.requester.id, ids.alice);
  assert.equal(response.body.swap.responder.id, ids.bob);
  assert.equal(response.body.swap.requester.email, undefined);
  assert.equal(response.body.swap.responder.password, undefined);
  assert.equal(response.body.swap.skillOffered, 'React');
  assert.equal(response.body.swap.message, 'Saturday?');
  assert.equal(response.body.swap.status, 'pending');
});

test('swap creation rejects self requests, private recipients, invalid ids and unavailable skills', async () => {
  const valid = { responder: ids.bob, skillOffered: 'React', skillRequested: 'Python' };
  for (const [body, status] of [
    [{ ...valid, responder: ids.alice }, 400],
    [{ ...valid, responder: ids.alice.toUpperCase() }, 400],
    [{ ...valid, responder: ids.private }, 404],
    [{ ...valid, responder: 'not-an-id' }, 400],
    [{ ...valid, skillOffered: 'Python' }, 400],
    [{ ...valid, skillRequested: 'React' }, 400],
    [{ ...valid, message: {} }, 400],
    [{ ...valid, status: 'accepted' }, 400],
  ]) {
    assert.equal((await request('/api/swaps', { method: 'POST', as: ids.alice, body })).status, status);
  }
});

test('only participants can list or read a swap', async () => {
  assert.equal((await request('/api/swaps', { as: ids.alice })).body.swaps.length, 1);
  assert.equal((await request('/api/swaps', { as: ids.bob })).body.swaps.length, 1);
  assert.deepEqual((await request('/api/swaps', { as: ids.outsider })).body.swaps, []);
  assert.equal((await request(`/api/swaps/${ids.swap}`, { as: ids.outsider })).status, 404);
  assert.equal((await request(`/api/swaps/${ids.swap}`, { as: ids.alice })).status, 200);
  assert.equal((await request('/api/swaps/not-an-id', { as: ids.alice })).status, 400);
});

test('a surviving participant can read a swap when the other account was removed', async () => {
  users.delete(ids.bob);
  const response = await request(`/api/swaps/${ids.swap}`, { as: ids.alice });
  assert.equal(response.status, 200);
  assert.equal(response.body.swap.requester.id, ids.alice);
  assert.equal(response.body.swap.responder, null);
  assert.equal((await request(`/api/swaps/${ids.swap}`, { as: ids.outsider })).status, 404);
});

test('only the recipient may accept or reject, and only the requester may cancel', async () => {
  assert.equal((await request(`/api/swaps/${ids.swap}`, { method: 'PATCH', as: ids.alice,
    body: { status: 'accepted' } })).status, 403);
  assert.equal((await request(`/api/swaps/${ids.swap}`, { method: 'PATCH', as: ids.bob,
    body: { status: 'cancelled' } })).status, 403);
  assert.equal((await request(`/api/swaps/${ids.swap}`, { method: 'PATCH', as: ids.outsider,
    body: { status: 'rejected' } })).status, 404);
  assert.equal((await request(`/api/swaps/${ids.swap}`, { method: 'PATCH', as: ids.bob,
    body: { status: 'accepted' } })).status, 200);
  assert.equal((await request(`/api/swaps/${ids.swap}`, { method: 'PATCH', as: ids.alice,
    body: { status: 'cancelled' } })).status, 409);
});

test('concurrent terminal transitions cannot overwrite a pending swap twice', async () => {
  const responses = await Promise.all(['accepted', 'rejected'].map((status) =>
    request(`/api/swaps/${ids.swap}`, { method: 'PATCH', as: ids.bob, body: { status } })));
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409]);
  assert.equal(['accepted', 'rejected'].includes(swaps.get(ids.swap).status), true);
});

test('requesters can cancel and recipients can reject pending swaps', async () => {
  const cancelled = await request(`/api/swaps/${ids.swap}`, { method: 'PATCH', as: ids.alice,
    body: { status: 'cancelled' } });
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.swap.status, 'cancelled');
  swaps.get(ids.swap).status = 'pending';
  const rejected = await request(`/api/swaps/${ids.swap}`, { method: 'PATCH', as: ids.bob,
    body: { status: 'rejected' } });
  assert.equal(rejected.status, 200);
  assert.equal(rejected.body.swap.status, 'rejected');
});

test('bad JSON bodies, unknown routes and disallowed CORS origins return JSON errors', async () => {
  assert.equal((await request('/api/user/register', { method: 'POST', body: [] })).status, 400);
  const malformed = await fetch(`${baseUrl}/api/user/register`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).message, 'Invalid JSON');
  assert.equal((await request('/missing')).status, 404);
  assert.equal((await request('/api/users', { origin: 'https://other.example' })).status, 403);
  assert.equal((await request('/api/users', { origin: 'http://localhost:5173' }))
    .headers.get('access-control-allow-origin'), 'http://localhost:5173');
});

test('startup rejects placeholder configuration before opening the database or HTTP port', () => {
  const valid = { MONGO_URI: 'mongodb://localhost:27017/test', JWT_SECRET: secret,
    FRONTEND_URL: 'http://localhost:5173', PORT: '5000' };
  assert.equal(validateEnvironment(valid).port, 5000);
  for (const changes of [
    { MONGO_URI: '' }, { JWT_SECRET: 'your-secret' },
    { JWT_SECRET: 'replace-with-a-random-secret-of-at-least-32-characters' },
    { FRONTEND_URL: '' }, { FRONTEND_URL: 'http://localhost:5173/path' }, { PORT: 'bad' },
  ]) assert.throws(() => validateEnvironment({ ...valid, ...changes }));
});
