module.exports = (app) => {
    const texts = require('../controllers/TextController.js');

    // Create a new Note
    app.post('/texts', texts.send);

}