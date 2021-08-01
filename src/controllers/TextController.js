const axios = require('axios');
const {saveText, getTexts, getText} = require('../database/TextsCollection');

exports.send = (req, resp) => {
    console.log('>>>>> TextController send');

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

    const result = getText(text.to_number, resp);
    console.log(result)

    sendText(text, resp);

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



function sendText(text, resp) {
    axios.post('https://jo3kcwlvke.execute-api.us-west-2.amazonaws.com/dev/provider1', text)
        .then((textReq) => {
            console.log('>>>>> axios post then');
            console.log(textReq.data);
            if (textReq.status !== 200) {
                return resp.status(500).send({
                    message: textReq.data
                });
            } else {
                return resp.status(200).send({
                    message_id: textReq.data.message_id
                });
            }
        })
        .catch((error) => {
            console.log(error);
            return resp.status(500).send({
                message: error
            });
        });
}