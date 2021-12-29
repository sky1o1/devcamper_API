const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title of the course"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter a description of the course"],
    max: [
      500,
      "Maximum characters exceeded. Please enter less than 500 characters.",
    ],
  },
  weeks: {
    type: Number,
    required: [true, "Please enter a weeks of the course"],
  },
  tuition: {
    type: Number,
    required: [true, "Please enter a tution cost of the course"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please enter a min skill for the course"],
    enum: ["beginner", "intermediate", "expert"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get avg cost od course
CourseSchema.statics.getAvgCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call get average cost after save
CourseSchema.post("save", function (next) {
  this.constructor.getAvgCost(this.bootcamp);
});

// Call get average cost before remove
CourseSchema.pre("remove", function (next) {
  this.constructor.getAvgCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
