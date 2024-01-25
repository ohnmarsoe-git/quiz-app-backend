import { Answers } from '../models/Answers.js';
import * as services from '../services/services.js'
import * as Answerservice from '../services/answerService.js';
import { handleErrors } from '../utils/handleErrors.js';

const getAll = async (req, res) => {
  try{
    const data = await services.getAll(Answers);
    res.status(200).json({status: "success", data});
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 
}

const getAllAns = async (req, res) => {

  const limit = req.params.id

  try{
    const data = await Answerservice.getAllAnswers(limit);
    res.status(200).json({status: "success", data});
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 
}

const getByUser = async (req, res) => {

  if(
    !req.params.id
  ) {
    return;
  }

  try{
    const data = await Answerservice.getByUserId({user: req.params.id});
    res.status(200).json({status: "success", data});
  } catch (errors) {
    console.log(errors);
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

  let renew = new Date();
  renew.setMonth(renew.getMonth() + 3);

  const addRecord = {
    user: req.body.user,
    category: req.body.category,
    question: req.body.question,
    score: req.body.score,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    renewDate: renew.toDateString("en-US", { timeZone: "UTC" }),
    updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
  }

  try {
    const created = await services.createNew( Answers, addRecord);
    if(created) {
      const results = await services.getAll(Answers);
      res.status(201).send({status: "OK", data: results });
    }
  } catch(error) {
    console.log(error);
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

  const updateNew = req.body;
  
  try {
    const result = await services.updateOne(Answers, req.params.id, updateNew);
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
  getAllAns,
  getByUser,
  getOne,
  createNew,
  updateOne,
  deleteOne
}