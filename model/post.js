const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  caption: { type: String },
  imagePath: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  TimeDayWeek: {
    type: String,
    required: false,
  },
  likes: [
    {
      creator: { type: String },
      isLiked: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Post", PostSchema);
