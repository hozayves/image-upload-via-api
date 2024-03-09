const express = require("express");
const { unlink } = require("fs").promises;
const app = express();
const multer = require("multer");
const path = require("path");

// Function for handle destination upload and remane file image
const storage = multer.diskStorage({
  destination: "./upload",
  filename: (req, file, callback) => {
    return callback(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// endpoint for upload image file
app.post("/upload", upload.single("profile"), (req, res) => {
  console.log(req.file);
  res.status(200).json({ message: req.file });
});

// Endpoint for delete file in directory
app.delete("/upload", async (req, res) => {
  const filePath = path.join(
    __dirname,
    "./upload",
    "profile_1710017096333.png"
  );
  try {
    await unlink(filePath);
    res.status(200).json({ message: "Profile Deleted!" });
  } catch (error) {
    console.log(error);
  }
});

function errorHandle(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ ok: false, message: err.message });
  }
}

app.use(errorHandle);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
