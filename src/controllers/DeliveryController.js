const {saveText, getText} = require('../database/TextsCollection');

exports.handle = (req, res) => {
    console.log('>>>>> DeliveryController handle');

    console.log(req.body)
};