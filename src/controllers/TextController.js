const axios = require('axios');
const {
    saveText,
    getLatestTextByPhoneNumber,
    updateTextMessageIdById
} = require('../database/TextsCollection');

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
            message: 'Text message send with message_id: ' + updateResult.message_id
        });
    } catch (err) {
        console.log('caught err: ' + err.message);
    }

};

function validateText(text) {
    if (!isValidPhoneNumber(text)) {
        return 'Please enter a valid phone number';
    }
    if (!isValidMessage(text)) {
        return 'Please enter a message that is not empty';
    }
    if (!isValidURL(text)) {
        return 'Please enter a valid callback URL';
    }
    return 'VALID';
}

function isValidPhoneNumber(text) {
    // Matches for a 10-digit number, while accounting for common formats such as:
    // (123) 456-7890
    // 123.456.7890
    // 123-456-7890
    const phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (text.to_number && text.to_number.match(phoneNumberRegex)) {
        return true;
    } else {
        return false;
    }
}

function isValidMessage(text) {
    if (text.message) {
        return true;
    } else {
        return false;
    }
}

function isValidURL(text) {
    const urlRegex = /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/;
    if (text.callback_url && text.callback_url.match(urlRegex)) {
        return true;
    } else {
        return false;
    }
}

async function sendText(text, resp) {
    console.log('>>>>> sendText');
    let response = null;
    try {
        response = await axios.post('https://jo3kcwlvke.execute-api.us-west-2.amazonaws.com/dev/provider1', text)
            .then((textResp) => {
                console.log('inside axios.post.then');
                if (!textResp || !textResp.data) {
                    return resp.status(500).send({
                        message: "No response from text service"
                    });
                } else if (textResp.status !== 200) {
                    return resp.status(textResp.status).send({
                        message: "Text not found with id " + text._id
                    });
                } else {
                    console.log('axios.post results: ' + textResp.data.message_id);
                    return textResp.data.message_id;
                }
            });
    } catch (err) {
        console.log('inside err');
        console.error(err.message);
        // console.error(err);
        return resp.status(500).send({
            message: "Error from text service: " + err.message
        });
    }
    return response;
}