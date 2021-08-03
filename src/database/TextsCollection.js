const {
	getDatabase
} = require('./mongo');
const Text = require('../models/text.model');

const collectionName = 'texts';

async function saveText(text, resp) {
	console.log('>>>>> saveText with text: ', text);
	// Create a Text
	const newText = new Text({
		to_number: text.to_number,
		message: text.message,
		callback_url: text.callback_url,
		status: null,
		message_id: null
	});

	// Save Text in the database
	const response = newText.save()
		.then(data => {
			console.log('inside save result: ', data);
			return data;
		}).catch(err => {
			return resp.status(500).send({
				message: 'Error saving text ' + JSON.stringify(text)
			});
		});
	return response;
}

function getLatestTextByPhoneNumber(to_number) {
	console.log('>>>>> getLatestTextByPhoneNumber with to_number: ' + to_number);
	
	// Get latest record with same phone number
	let response = Text.find({ to_number: to_number }).sort({ createdAt: -1 }).limit(1)  
		.then(text => {
			console.log('getLatestTextByPhoneNumber result: ', text);
			if (!text) {
				return null;
			}
			return text;
		}).catch(err => {
			console.log('getLatestTextByPhoneNumber error result:');
			console.log(err);
			return resp.status(500).send({
				message: `Error getting text with to_number ${to_number}: ${err.message}`
			});
		});
	return response;
}

async function updateTextMessageIdById(text, message_id, resp) {
	console.log('>>>>> updateTextById with message_id: ' + message_id);
	text.message_id = message_id;
	const response = await Text.findByIdAndUpdate(text._id, text, {
			new: true
		})
		.then(text => {
			console.log('updateTextMessageIdById result: ' + text);
			if (!text) {
				return resp.status(404).send({
					message: "Text not found with id " + text._id
				});
			}
			return text;
		}).catch(err => {
			return resp.status(500).send({
				message: `Error updating text with id ${text._id}: ${err.message}`
			});
		});
	return await response;
};

async function updateTextStatusByMessageId(reqBody, resp) {
	console.log('>>>>> updateTextStatusByMessageId with message_id: ' + reqBody.message_id);
	const response = await Text.findOneAndUpdate({ message_id: reqBody.message_id }, { status: reqBody.status }, {
			new: true
		})
		.then(text => {
			console.log('updateTextStatusByMessageId result: ' + text);
			if (!text) {
				return resp.status(404).send({
					message: "Text not found with id " + text._id
				});
			}
			return text;
		}).catch(err => {
			return resp.status(500).send({
				message: `Error updating text status with message_id ${reqBody.message_id}: ${err.message}`
			});
		});
	return await response;
};

module.exports = {
	saveText,
	getLatestTextByPhoneNumber,
	updateTextMessageIdById,
	updateTextStatusByMessageId
};