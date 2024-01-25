import mongoose from 'mongoose';

const quizSchemea = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  level: {
    type: String,
    requierd: [true, 'Please enter level']
  },
  question: {
    type: String,
    unique: true,
    required: [true, 'Please enter question']
  },
  answers: {
    type: [String],
    required: [true, 'Please enter answers']
  },
  correct_answer: {
    type: String,
    required: [true, 'Please enter an correct answer'],
  },
  createdAt : {
    type: Date,
    require: true
  },
  updatedAt: {
    type: Date,
    require: true
  }

})

// fire a function before doc saved to db
// quizSchemea.pre('save', async function(next) {
//   console.log('New Quiz is about to be created and saved', this);
//   next();
// })

const Quiz = mongoose.model('quiz', quizSchemea);

export {
  Quiz
}