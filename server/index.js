// Placeholder for index.jsconst 
express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const problemRoutes = require("./routes/problems");
const submitRoutes = require("./routes/submit");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));



app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submit", submitRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));