const { updateTextStatusByMessageId } = require('../database/TextsCollection');

exports.handle = async (req, resp) => {
    console.log('>>>>> DeliveryController handle');
    console.log(req.body);
    
    const updateResult = await updateTextStatusByMessageId(req.body, resp);
    try {
        return resp.status(200).send({
            message: 'Callback received'
        });
    } catch (err) {
        console.log('caught err: ' + err.message);
    }
    
};