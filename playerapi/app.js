const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8000;
const mm = require("music-metadata");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("hello");
});

app.post("/get-metadata", upload.single("audioFile"), async (req, res) => {

  try {
    const metadata = await mm.parseBuffer(req.file.buffer, "audio/mpeg");
    res.json(metadata);
  } catch (error) {
    console.error("Error reading metadata:", error.message);
    res.status(500).json({ error: "Failed to read metadata" });
  }
});

app.listen(port, () => {
  console.log(`App is listening at the port ${port}`);
});
