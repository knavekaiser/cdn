const express = require("express");
const path = require("path");
var multer = require("multer");
const cors = require("cors");
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log("CDN listening to port:", PORT);
});

const storage = multer.diskStorage({
  destination: "./public",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({
  storage,
}).array("file");

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (req.files) {
      res.json({ code: "ok", files: req.files.map((item) => item.filename) });
    } else {
      res.status(500).json({ code: 500, message: "something went wrong" });
    }
  });
});
