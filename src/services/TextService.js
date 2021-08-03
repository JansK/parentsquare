const axios = require('axios');

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

module.exports = {
    sendText
};