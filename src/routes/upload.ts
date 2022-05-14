import { Router } from "express";
import crypto from "crypto";
import path from "path";
import mongoose, { connection } from "mongoose";
import { GridFsStorage as GridFsStorageLib } from "multer-gridfs-storage/lib/gridfs";
import { GridFsStorage } from "multer-gridfs-storage";
import multer, { Multer } from "multer";
import { GridFSBucket } from "mongodb";
import { IGridFSFile } from "../types";
import { mongoUrl } from "../secret";
// const jsonParser = express.json();
const router = Router();

// connection
const conn: typeof connection = mongoose.createConnection(mongoUrl, {});

// init gfs
let gfs: GridFSBucket;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

// Storage
const storage: GridFsStorageLib = new GridFsStorage({
  url: mongoUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload: Multer = multer({
  storage,
});

// Rotes

// main page
router.get("/all", (req, res) => {
  if (!gfs) {
    console.log("some error occured, check connection to db");
    res.send("some error occured, check connection to db");
    process.exit(0);
  }
  gfs.find().toArray((err, files?: IGridFSFile[]) => {
    // check if files
    if (!files || files.length === 0) {
      return res.render("upload", {
        files: false,
      });//
    } else {
      const f = files
        .map((file: IGridFSFile) => {
          if (
            file.contentType === "image/png" ||
            file.contentType === "image/jpeg"
          ) {
            file.isImage = true;
          } else if (
            file.contentType === "video/mp4" ||
            file.contentType === "video/mpeg"
          ) {
            file.isVideo = true;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b["uploadDate"]).getTime() -
            new Date(a["uploadDate"]).getTime()
          );
        });

    //   return res.render("upload", {
    //     files: f,
    //   });
      return res.render("upload", {
        files: false,
      });//

      return res.json(f);
    }
  });
});

// upload file
router.post("/add", upload.single("file"), (req, res) => {
  // res.json({ file: req.file });
  res.redirect("/api/upload/all");
});

// remove chunks from the db
router.post("/remove/:_id", (req, res) => {
  gfs.delete(new mongoose.Types.ObjectId(req.params._id), (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
    res.redirect("/api/upload/all");
  });
});

// link to download
router.get("/download/:filename", (req, res) => {
  gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist",
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

// get file by filename
router.get("/file/:id", (req, res) => {
  gfs.find(new mongoose.Types.ObjectId(req.params.id)).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist",
      });
    }
    return res.json(files[0]);
  });
});

export default router;
