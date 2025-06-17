const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  title: String,
  description: String,
  inputFormat: String,
  outputFormat: String,
  testCases: [
    {
      input: String,
      expectedOutput: String, // Changed from 'output' to 'expectedOutput'
    },
  ],
});

module.exports = mongoose.model("Problem", ProblemSchema);