const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  updateStudent,
  createStudent,
  deleteStudent,
} = require("../controllers/student.controller");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  )
    cb(null, true);
  else
    cb(
      new Error("Error Occured: Here Only jpeg,png files are included."),
      false,
    );
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 3 },
});
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", upload.single("profile_pic"), createStudent);
router.put("/:id", upload.single("profile_pic"), updateStudent);
router.delete("/:id", deleteStudent);
module.exports = router;
