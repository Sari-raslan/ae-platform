const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "ae_platform_secret";

let users = [];

app.get("/", (req, res) => {
  res.json({
    app: "AE Platform",
    status: "running"
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    app: "AE Platform",
    backend: "online",
    auth: "enabled",
    billing: "premium-ready"
  });
});

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    password: hash,
    plan: "free"
  };

  users.push(user);

  res.json({
    message: "registered",
    user
  });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(x => x.email === email);

  if (!user) {
    return res.status(401).json({
      error: "invalid"
    });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.status(401).json({
      error: "invalid"
    });
  }

  const token = jwt.sign(
    {
      email: user.email,
      plan: user.plan
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  res.json({
    token,
    user
  });
});

app.get("/api/dashboard", (req, res) => {
  res.json({
    users: users.length,
    revenue: "0€",
    plans: [
      "Starter",
      "Premium",
      "Pro"
    ]
  });
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
