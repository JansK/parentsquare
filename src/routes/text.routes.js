module.exports = (app) => {
    const texts = require('../controllers/TextController.js');

    app.post('/texts', texts.send);

}