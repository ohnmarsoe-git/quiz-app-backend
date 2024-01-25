import { Category } from '../models/Category.js';
import * as services from '../services/services.js'
import { handleErrors } from '../utils/handleErrors.js';

const getAllCategory = async (req,res) => {
  try{
    const results = await services.getAll(Category);
    res.status(200).send({status: "success", data: results});
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(400).send({ errors})
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
    category: (req.body.category).toLowerCase()
  }

  try {
    const created = await services.createNew(Category, addNew);
    if(created) {
      const results = await services.getAll(Category);
      res.status(201).send({status: "success", data: results });
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

  const updateNew = {
    category: req.body.category,
  }
  
  try {
    const result = await services.updateOne(Category, req.params.id, updateNew);
    if(result) {
      const results = await services.getAll(Category);
      res.status(200).send({status: "success", data: results});
    }
    
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
    const result = await services.deleteOne(Category, req.params.id);
    if(result) {
      const results = await services.getAll(Category);
      res.status(200).send({status:"success", data: results});
    }
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  }
}

export  {
  getAllCategory,
  getOne,
  createNew,
  updateOne,
  deleteOne
}