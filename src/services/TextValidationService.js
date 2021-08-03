function validateText(text) {
    if (!isValidPhoneNumber(text)) {
        return 'Please enter a valid phone number. Phone number must be 10 numbers. The following are examples of acceptable formats: ' +
        '(123) 456-7890, 123.456.7890, 123-456-7890, and 1234567890.';
    }
    if (!isValidMessage(text)) {
        return 'Please enter a message that is not empty';
    }
    if (!isValidURL(text)) {
        return 'Please enter a valid callback URL. The following is an example of an acceptable format: http://a5dfebd9004b.ngrok.io/delivery.';
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
    const urlRegex = /\b(https?):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/;
    if (text.callback_url && text.callback_url.match(urlRegex)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    validateText
};