const mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
  voted: [String],
  question: {
    type: String,
    required: true,
    trim: true,
    minlength: 20
  },
  options: [
    {
      text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
      },
      votes: {
        type: Number,
        default: 0
      },
      _creator: mongoose.Schema.Types.ObjectId
    }
  ],
  _author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});
pollSchema.path("options").validate(options => {
  if (!options) return false;
  else if (options.length < 2) return false;
  return true;
}, "You have to provide at least two options");

pollSchema.pre('save', function (next) {
  var poll = this;
  poll.options = poll.options.map(function (option) {
    return {
      _id: option._id,
      text: option.text,
      votes: option.votes,
      _creator: poll._author
    }
  });
  next();
})

var Poll = mongoose.model("Poll", pollSchema);

module.exports = {
  Poll
}