import { Answers } from '../models/Answers.js';

const getAllAnswers = async (count) => {

  const populateQuery = [
  {
    path: 'user',
    select: 'firstName lastName email role'
  },
  {
    path: 'category',
    select: 'category'
  }
]
  //const allResults = await Answers.find().populate('user').populate('category').exec();
  const allResults = await Answers.find().populate(populateQuery).sort('-createdAt').limit(count).exec();
  return allResults;
}

const getByUserId = async (filter) => {
  const populateQuery = [
    {
      path: 'user',
      select: 'firstName lastName email'
    },
    {
      path: 'category',
      select: 'category'
    }
  ]

  const allResults = await Answers.find(filter).populate(populateQuery).sort('-createdAt').limit().exec();;
  return allResults;
}

const getByUser = async (filter) => {
  const allResults = await Answers.find(filter).count().exec();
  return allResults;
}

export {
  getAllAnswers,
  getByUserId,
  getByUser
}
