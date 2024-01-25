import { Quiz } from '../models/Quiz.js';
import { Category } from '../models/Category.js';

const getAll = async () => {
  const allResults = await Quiz.find().populate('category').exec();
  return allResults;
}

const getCount = async () => {
  const allResults = await Quiz.countDocuments({}).exec();;
  return allResults;
}

const getByCategory = async () => {
  const allResults = await Quiz.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $count: {} }
      },
    },
    { $lookup: 
      {
        from: 'categories', 
        localField: '_id', 
        foreignField:'_id', 
        as: 'category'
      }
    }

  ]).exec();

  return allResults;
}

const getByCategoryLevel = async (filter) => {
  const allResults = await Quiz.find(filter).populate('category').exec();
  return allResults;
}

const getOne = async (id) => {
  const result = await Quiz.findById(id).exec();
  return result;
}

const createNew = (addNew) => {
  const createdNew = Quiz.create(addNew);
  return createdNew;
}

const updateOne = (id, updateNew) => {
  
  const updateNewInsert = {
    ...updateNew,
    updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" })
  };

  const updateNewOne = Quiz.findByIdAndUpdate(
    id,
    updateNewInsert,
    { new: true }
  );

  return updateNewOne;
}

const deleteOne = (id) => {
  
  const deleteRecord = Quiz.findByIdAndRemove(id);

  return deleteRecord;
}

export {
  getAll,
  getCount,
  getByCategory,
  getByCategoryLevel,
  getOne,
  createNew,
  updateOne,
  deleteOne
}
