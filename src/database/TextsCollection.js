const { getDatabase } = require('./mongo');
const Text = require('../models/text.model');

const collectionName = 'texts';

async function saveText(text) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(text);
  return insertedId;
}

async function getTexts() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

function getText(to_number) {
  console.log('>>>>> getText with to_number: ' + to_number);
  Text.findOne({to_number: to_number})
  .then(text => {
    console.log(' getText result: ' + text);
      if(!text) {
          return null;     
      }
      return text;
  }).catch(err => {
    console.log('getText error result:');
    console.log(err);
    return null;
  });
  }

module.exports = {
    saveText,
    getTexts,
    getText
};