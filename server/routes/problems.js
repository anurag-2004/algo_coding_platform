// Placeholder for problems.js
const express = require("express");
const Problem = require("../models/Problem");
const router = express.Router();

router.get("/", async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

module.exports = router;