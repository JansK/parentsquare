module.exports = (app) => {
    const textController = require('../controllers/TextController.js');

    app.post('/texts', textController.send);

}