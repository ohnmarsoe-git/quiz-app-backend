import * as fs from 'fs'

const saveToDabase = (DB) => {
  try {
    fs.writeFileSync('./db/db.json', JSON.stringify(DB, null, 2),  {
      encoding: "utf-8"
    });
    console.log("Data successfully saved");
  } catch (err) {
    console.log(err.message)
  };
}

// filter function
const isAlreadyFilter = (filterBy, objList) => {
  return objList.filter(function(obj) {
    return obj.questions.some(function(item) {
      return item.question.indexOf(filterBy) >= 0;
    });
  });
}

const isFilterCategory = (filterBy, objList) => {
  return objList.filter(function(obj) {
    return obj.category.indexOf(filterBy) >= 0;
  });
}

export { 
  saveToDabase,
  isAlreadyFilter,
  isFilterCategory
 };