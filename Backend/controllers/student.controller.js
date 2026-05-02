const Mongoose = require("mongoose");
const Student = require("../models/student.models");
const path = require("path");
const fs = require("fs");
const getAllStudents = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const query = {
      $or: [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
      ],
    };
    const total = await Student.countDocuments(query);
    const students = await Student.find(query).skip(skip).limit(limit);
    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
      data: students,
    });
  } catch (error) {
    console.log("getAllStudents Error");
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//http:localhost:3000?page=1&limit=5
const getStudentById = async (req, res) => {
  try {
    if (!Mongoose.Types.ObjectId.isValid(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Id Found" });
    const student = await Student.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.log("getStudentById Error");
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    if (req.file) {
      student.profile_pic = req.file.filename;
    }
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.log("createStudent Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const updateStudent = async (req, res) => {
  try {
    if (!Mongoose.Types.ObjectId.isValid(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Id Found" });

    const updateOldStudent = await Student.findById(req.params.id);
    if (!updateOldStudent) {
      if (req.file) {
        console.log("OK!", req.file.filename);
        const filePath = path.join("./uploads", req.file.filename);
        console.log("OK!", filePath);
        await fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Failed to Delete this image.Due to Some Server Issue.",
              errors: `${err}`,
            });
          }
        });
      }
    }
    if (req.file) {
      if (updateOldStudent.profile_pic) {
        const filePath = path.join("./uploads", updateOldStudent.profile_pic);
        await fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Failed to Delete this image.Due to Some Server Issue.",
              errors: `${err}`,
            });
          }
        });
      }
      req.body.profile_pic = req.file.filename;
    }
    console.log(req.body);
    const updateStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).json(updateStudent);
  } catch (error) {
    console.log("Error=> : ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const deleteStudent = async (req, res) => {
  try {
    if (!Mongoose.Types.ObjectId.isValid(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Id Found" });
    const deleteStudent = await Student.findByIdAndDelete(req.params.id);
    if (deleteStudent.profile_pic) {
      const oldPath = path.join("./uploads", deleteStudent.profile_pic);
      await fs.unlink(oldPath, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Failed to Delete this image.Due to Some Server Issue.",
            errors: `${err}`,
          });
        }
      });
    }
    res.status(200).json({
      success: true,
      message: "This student record is deleted succesfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
  createStudent,
  deleteStudent,
};
