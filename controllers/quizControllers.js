import { Quiz } from '../models/Quiz.js';
import * as services from '../services/quizService.js'
import { getByUser } from '../services/answerService.js'
import { handleErrors } from '../utils/handleErrors.js';

const getAll = async (req, res) => {
  if(
    !req.body
  ) {
    return;
  }

  // const category = req.body?.category || req.query?.category

  try{
    const data = await services.getAll();
    res.status(200).json({status: "success", data});
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 
}

const getAllCount = async (req, res) => {
  try{
    const data = await services.getCount();
    res.status(200).json({status: "success", data});
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 
}

const getByCategory = async (req, res) => {
  try{
    const results = await services.getByCategory();
    res.status(200).send({status: "success", data: results});
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 
}

const getCategoryLevel = async (req, res) => {
  if(
    !req.body
  ) {
    return;
  }

  try{
      const results = await services.getByCategoryLevel({
        $and: [
            {category: req.body.category},
            {level: req.body.level}
        ]
    });
      res.status(200).send({status: "success", data: results});
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 
}

const getFilterByUser = async (req, res) => {
  if(
    !req.body
  ) {
    return;
  }

  try{

    const user = await getByUser({
      $and: [
        {user: req.body.id},
        {category: req.body.category},
        // {renewDate: {$gt: '2024-02-20T17:30:00.000+00:00'}}
        {renewDate: {$gt: new Date().toLocaleString("en-US", { timeZone: "UTC" })}}
      ]
    });

    if(user < 3) {
      const results = await services.getByCategoryLevel({
        $and: [
            {category: req.body.category},
            {level: req.body.level}
        ]
    });
      res.status(200).send({status: "success", data: results});
    } else {
      res.status(200).send({status: "success", data: 'NotAllowed'});
    }
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 
}

const getOne = async (req, res) => {

  if(
    !req.params.id
  ) {
    return;
  }
  

  try {
    const result = await services.getOne(req.params.id);
    res.status(200).send({status: "success", data: result});
  } catch(errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  }
  
}

const createNew = async (req, res) => {

  if(
    !req.body
  ) {
    return;
  }

  const addNew = {
    category: req.body.category,
    level: req.body.level,
    question: req.body.question,
    answers: req.body.answers,
    correct_answer: req.body.correct_answer,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" })
  }

  try {
    const created = await services.createNew(addNew);
    if(created) {
      const results = await services.getAll();
      res.status(201).send({status: "OK", data: results });
    }
  } catch(error) {
    const errors = handleErrors(error);
    res.status(500).send({ errors: errors });
  }
}

const updateOne = async (req, res) => {


  if(
    !req.params.id
  ) {
    return;
  }


  // const updateNew = {
  //   category: req.body.category,
  //   level: req.body.level,
  //   question: req.body.question,
  //   answers: req.body.answers,
  //   correct_answer: req.body.correct_answer
  // }

  const updateNew = req.body;
  
  try {
    const result = await services.updateOne(req.params.id, updateNew);
    res.status(200).send({status: "success", data: result});
  } catch(errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  }

}

const deleteOne = async (req, res) => {
  if(
    !req.params.id
  ) {
    return;
  }

  try {
    const del = await services.deleteOne(req.params.id);
    if(del) {
      const results = await services.getAll();
      res.status(200).send({status: "OK", data: results });
    }
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  }
}

export  {
  getAll,
  getAllCount,
  getByCategory,
  getCategoryLevel,
  getFilterByUser,
  getOne,
  createNew,
  updateOne,
  deleteOne
}