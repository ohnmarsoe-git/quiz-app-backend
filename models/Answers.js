import mongoose from 'mongoose';

const answersSchemea = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  score: {
    type: Number,
  },
  createdAt : {
    type: Date,
    require: true
  },
  renewDate: {
    type: Date,
    require: true
  },
  updatedAt: {
    type: Date,
    require: true
  }
})

const Answers = mongoose.model('Answers', answersSchemea);

export {
  Answers
}