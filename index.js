// server/index.js
const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome To The Chat App With Pusher",
  });
});

// Routes
app.post("/api/messages", async (req, res) => {
  const { message, sender } = req.body;

  try {
    await pusher.trigger("chat", "message", {
      message,
      sender,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
