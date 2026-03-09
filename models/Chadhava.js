const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  image: {
    url: { type: String },
    delete_url: { type: String },
  },
  // image_hi:{
  //   url: { type: String},
  //   delete_url: { type: String}
  // },
  price: Number,
  description: String,
  descriptionHi: String,
  title: String,
  titleHi: String,
});

const chadhavaSchema = new mongoose.Schema(
  {
    title: String,
    titleHi: String,
    subtitle: String,
    subtitleHi: String,

    desc: String,
    desc_hi: String,

    // mandir: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Temple",
    //   required: true,
    // },
    mandir: String,
    mandirHi: String,
    images: {
      type: [
        {
          url: { type: String, required: false },
          delete_url: { type: String, required: false },
        },
      ],
      validate: [(arr) => arr.length <= 5, "{PATH} exceeds 5"],
    },
    images_hi: {
      type: [
        {
          url: { type: String, required: false },
          delete_url: { type: String, required: false },
        },
      ],
      validate: [(arr) => arr.length <= 5, "{PATH} exceeds 5"],
    },
    benefit: [
      {
        title: { type: String, required: false },
        titleHi: { type: String, required: false },
        description: { type: String, required: false },
        descriptionHi: { type: String, required: false },
      },
    ],
    faq: [
      {
        question: { type: String, required: false },
        questionHi: { type: String, required: false },
        answer: { type: String, required: false },
        answerHi: { type: String, required: false },
      },
    ],
    startDate: Date,
    chadhava: Number,
    items: [itemSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chadhava", chadhavaSchema);
