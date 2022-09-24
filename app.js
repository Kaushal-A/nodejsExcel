const express = require("express");
const multer = require("multer");
const fileHandeling = require("./controller/fileHandeling");
const path = require("path");

const app = express();

const fsEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./file");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: fsEngine });

//Endpoint : localhost:8080/upload

app.post("/upload", upload.single("xl"), (req, res) => {
  //   res.send("single file upload successfull");
  let a = fileHandeling();
  let flname = "text.xlsx";
  res.sendFile(flname, path.join(__dirname, file));
});

app.listen(8080);
