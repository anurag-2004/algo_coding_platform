const express = require("express");
const axios = require("axios");
const Problem = require("../models/Problem");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

const runCode = async (code, input, language = "python3") => {
  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      stdin: input,
      language: language,
      versionIndex: "3",
    });

    return response.data.output;
  } catch (err) {
    console.error("JDoodle error:", err.response?.data || err.message);
    return null;
  }
};

// 🔒 Protect this route with JWT middleware
router.post("/:id", verifyToken, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    const { code, language } = req.body;

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    let results = [];
    for (let testCase of problem.testCases) {
      const result = await runCode(code, testCase.input, language);
      
      // Handle the case where result is null (execution failed)
      let actualOutput, isPass;
      
      if (result === null) {
        actualOutput = "Execution failed";
        isPass = false;
      } else {
        actualOutput = result;
        // Use expectedOutput instead of output
        const resultTrimmed = result.toString().trim();
        const expectedTrimmed = testCase.expectedOutput.toString().trim();
        isPass = resultTrimmed === expectedTrimmed;
      }

      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput, // Changed from testCase.output
        received: actualOutput,
        pass: isPass,
      });
    }

    res.json({ results });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;