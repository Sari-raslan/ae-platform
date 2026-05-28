const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dbFile = path.join(__dirname, "../data/users.json");

function ensureDb() {
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [] }, null, 2));
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function createToken(email) {
  return Buffer.from(JSON.stringify({ email, createdAt: Date.now() })).toString("base64url");
}

function register(email, password) {
  const db = readDb();

  if (db.users.find(u => u.email === email)) {
    return { ok: false, error: "User already exists" };
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash: hashPassword(password),
    libraries: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  writeDb(db);

  return {
    ok: true,
    token: createToken(email),
    user: { id: user.id, email: user.email }
  };
}

function login(email, password) {
  const db = readDb();
  const user = db.users.find(u => u.email === email);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return { ok: false, error: "Invalid login" };
  }

  return {
    ok: true,
    token: createToken(email),
    user: { id: user.id, email: user.email }
  };
}

function me(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    const db = readDb();
    const user = db.users.find(u => u.email === decoded.email);

    if (!user) return { ok: false };

    return {
      ok: true,
      user: { id: user.id, email: user.email }
    };
  } catch {
    return { ok: false };
  }
}

module.exports = {
  register,
  login,
  me
};
