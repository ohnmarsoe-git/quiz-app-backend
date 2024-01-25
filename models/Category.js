import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
})

const Category = mongoose.model('Category', categorySchema)

export {
  Category
}