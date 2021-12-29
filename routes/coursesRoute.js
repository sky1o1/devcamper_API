const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getCourses,
  getCourse,
  addCourse,
  putCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), putCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
