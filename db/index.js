import DB from './db.json' assert {type: 'json'}
import { saveToDabase, isAlreadyFilter, isFilterCategory } from '../utils/utils.js'

const getAllResults = () => {
  return DB
}

const createNewOne = (addNew) => {
  let data = JSON.parse(JSON.stringify(DB));
  
  const newQuestion = 
    {
      'question': addNew.questions[0].question,
      'answer': addNew.questions[0].answers,
      'correct_answer': addNew.questions[0].correct_answer
    }

  const newgroupQuestion = {
    'category' : addNew.category,
    'level' : addNew.level,
    'questions' : [newQuestion]
  }
  
  let isAlreadyAdded;
  isAlreadyAdded = isAlreadyFilter( addNew.questions[0].question, DB);
  
  if(isAlreadyAdded.length > 0) { return; }

  let isAleradyCategory = isFilterCategory(addNew.category, DB);

  if(isAleradyCategory.length > 0 ) {
    const updatedArray = data.map( (d) => {
      if(d.category === addNew.category) {
        // d.questions.push(...newQuestion)
        d.questions =  [...d.questions, newQuestion ];
        return d;
      }else {
        return d;
      }
    })
    saveToDabase(updatedArray);
  } else {
    const updatedArray = [...data, newgroupQuestion ];
    saveToDabase(updatedArray);
    return updatedArray;
  }

  return addNew;
}

export {
  getAllResults,
  createNewOne
}