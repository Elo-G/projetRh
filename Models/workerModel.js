const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  img: {
    type: String,
    required: [true, "photo requise"],
  },
  name: {
    type: String,
    required: [true, "nom requis"],
  },
  firstName: {
    type: String,
    required: [true, "prénom requis"],
  },
  workStation: {
    type: String,
    required: [true, "poste requis"],
  },
  blameNumber: {
    type: Number,
    default: 0,
  },
  compagnyId: {
    type: String,
  },
});

const workerModel = mongoose.model("workers", workerSchema);
module.exports = workerModel;
