const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    star: { type: Number, default: 5 },
    content: { type: String },
  },
  {
    timestamps: true,
  }
);

const rateModel = mongoose.model("rate", rateSchema);

module.exports = rateModel;
