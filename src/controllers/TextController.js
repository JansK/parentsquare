const axios = require('axios');
const {saveText, getLatestTextByPhoneNumber, updateTextMessageIdById} = require('../database/TextsCollection');

exports.send = async (req, resp) => {
    console.log('>>>>> TextController send');

    // Validate body
    if (!req.body) {
        return resp.status(400).send({
            message: 'Body can not be empty'
        });
    }
    const text = req.body;
    console.log(text);
    const validationResult = validateText(text);
    if (validationResult !== 'VALID') {
        return resp.status(400).send({
            message: validationResult
        });
    }

    // Check if number has been used in the past
    const getResult = await getLatestTextByPhoneNumber(text.to_number, resp);
        // check if we've seen this number before but we don't know if it's valid or not
        // i.e. the text service hasn't sent its callback yet
    if (getResult && !getResult.status) {
        return resp.status(400).send({
            message: 'Status of phone number is unknown.'
        });
    }
    if (getResult && getResult.status && getResult.status === 'invalid') {
        console.log('inside invalid block')
        return resp.status(400).send({
            message: 'Phone number is invalid. You cannot send messages to this phone number.'
        });
    }
    const saveResult = await saveText(text, resp);
    // console.log('outside saveResult: ' + JSON.stringify(saveResult));
    console.log('outside saveResult: ', saveResult);
    const sendResult = await sendText(saveResult, resp);
    console.log('type of sendResult' + typeof sendResult);
    console.log(typeof sendResult); // should be string
    const updateResult = await updateTextMessageIdById(saveResult, sendResult, resp);
    console.log('outside all: ', JSON.stringify(sendResult));
    try {
        return resp.status(200).send({
            message: 'Text message send with message_id: ' + sendResult
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
            if (!textResp) {
                return resp.status(500).send({
					message: "No response from text service"
				});
            } else if (textResp.status !== 200) {
                return resp.status(textResp.status).send({
					message: "Text not found with id " + text._id
				});
            } else {
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
    console.log('outside try/catch');
    console.log(response);
    return response;
}