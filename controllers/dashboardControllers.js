import { User } from '../models/User.js';
import { Answers } from '../models/Answers.js';
import {Quiz} from '../models/Quiz.js'
import * as services from '../services/services.js'
import * as Answerservice from '../services/answerService.js';
import { handleErrors } from '../utils/handleErrors.js';

const getAll = async (req, res) => {
  try{
    const answer  = await Answerservice.getAllAnswers(10);
    const answerCount = answer.length;
    const userCount = await services.getCount(User);
    const quizCount = await services.getCount(Quiz);

    const data = {
      userCount,
      quizCount,
      answerCount,
      answer
    }
    res.status(200).json({status: "success", data});
  } catch (errors) {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 
}

export  {
  getAll
}