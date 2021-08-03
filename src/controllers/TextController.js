
const {
    saveText,
    getLatestTextByPhoneNumber,
    updateTextMessageIdById
} = require('../database/TextsCollection');
const {
    sendText
} = require('../services/TextService');
const {
    validateText
} = require('../services/TextValidationService');

exports.send = async (req, resp) => {
    console.log('>>>>> TextController send');

    // Validate body
    if (!req.body) {
        return resp.status(400).send({
            message: 'Body can not be empty'
        });
    }
    const text = req.body;
    const validationResult = validateText(text);
    if (validationResult !== 'VALID') {
        return resp.status(400).send({
            message: validationResult
        });
    }

    // Check if number has been used in the past. 
    // If it has been, need to check if status is invalid.
    let lastText = null;
    let getResult = await getLatestTextByPhoneNumber(text.to_number, resp);
    if (Array.isArray(getResult) && getResult.length == 1) {
        lastText = getResult[0];
        console.log('last text: ', lastText);
    }
    if (lastText && lastText.status && lastText.status === 'invalid') {
        return resp.status(400).send({
            message: 'Phone number is invalid. You cannot send messages to this phone number.'
        });
    }

    const saveResult = await saveText(text, resp);
    const sendResult = await sendText(saveResult, resp);
    if (typeof sendResult === 'object') {
        return sendResult;
    }
    const updateResult = await updateTextMessageIdById(saveResult, sendResult, resp);
    try {
        return resp.status(200).send({
            message_id: updateResult.message_id
        });
    } catch (err) {
        console.log('caught err: ' + err.message);
    }

};