module.exports = (app) => {
    const delivery = require('../controllers/DeliveryController.js');

    app.post('/delivery', delivery.handle);

}