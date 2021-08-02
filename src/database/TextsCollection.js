const {
	getDatabase
} = require('./mongo');
const Text = require('../models/text.model');

const collectionName = 'texts';

async function saveText(text, resp) {
	console.log('>>>>> saveText with text: ' + JSON.stringify(text));
	// Create a Text
	const newText = new Text({
		to_number: text.to_number,
		message: text.message,
		callback_url: text.callback_url,
		status: null,
		message_id: null
	});

	// Save Text in the database
	const response = await newText.save()
		.then(data => {
			console.log('inside save result: ', data);
			return data;
		}).catch(err => {
			return resp.status(500).send({
				message: 'Error saving text ' + JSON.stringify(text)
			});
		});
	// console.log('response await newText.save: ' + JSON.stringify(response));
	return response;
}

async function getLatestTextByPhoneNumber(to_number) {
	console.log('>>>>> getTextByPhoneNumber with to_number: ' + to_number);
	
	// Get latest record with same phone number
	await Text.find({ to_number: to_number }).sort({ createdAt: -1 }).limit(1)  
		.then(text => {
			console.log('getTextByPhoneNumber result: ' + text);
			if (!text) {
				return null;
			}
			return text;
		}).catch(err => {
			console.log('getTextByPhoneNumber error result:');
			console.log(err);
			return resp.status(500).send({
				message: `Error getting text with to_number ${to_number}: ${err.message}`
			});
		});
}

async function getTextByMessageId(message_id) {
	console.log('>>>>> getTextByMessageId with message_id: ' + message_id);
	await Text.findOne({
			message_id: message_id
		})
		.then(text => {
			console.log('getTextByMessageId result: ' + text);
			if (!text) {
				return null;
			}
			return text;
		}).catch(err => {
			console.log('getTextByMessageId error result:');
			console.log(err);
			return resp.status(500).send({
				message: `Error getting text with message_id ${message_id}: ${err.message}`
			});
		});
}

async function updateTextMessageIdById(text, message_id, resp) {
	console.log('>>>>> updateTextById with message_id: ' + message_id);
	text.message_id = message_id;
	await Text.findByIdAndUpdate(text._id, text, {
			new: true
		})
		.then(text => {
			if (!text) {
				return resp.status(404).send({
					message: "Text not found with id " + text._id
				});
			}
			console.log('updateTextMessageIdById result: ' + text);
			return text;
		}).catch(err => {
			return resp.status(500).send({
				message: `Error updating text with id ${text._id}: ${err.message}`
			});
		});
};

async function updateTextStatusByMessageId(reqBody, resp) {
	console.log('>>>>> updateTextStatusByMessageId with message_id: ' + reqBody.message_id);
	await Text.findOneAndUpdate({ message_id: reqBody.message_id }, { status: reqBody.status }, {
			new: true
		})
		.then(text => {
			if (!text) {
				return resp.status(404).send({
					message: "Text not found with id " + text._id
				});
			}
			console.log('updateTextStatusByMessageId result: ' + text);
			return text;
		}).catch(err => {
			return resp.status(500).send({
				message: `Error updating text status with message_id ${reqBody.message_id}: ${err.message}`
			});
		});
};

module.exports = {
	saveText,
	getLatestTextByPhoneNumber,
	getTextByMessageId,
	updateTextMessageIdById,
	updateTextStatusByMessageId
};