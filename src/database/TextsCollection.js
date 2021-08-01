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
			console.log('inside save result: ');
			console.log(data)
			return data;
		}).catch(err => {
			return resp.status(500).send({
				message: err.message || "An error occurred while saving the Text."
			});
		});
	console.log('response await newText.save: ' + JSON.stringify(response));
	return response;
}

async function getTextByPhoneNumber(to_number) {
	console.log('>>>>> getTextByPhoneNumber with to_number: ' + to_number);
	await Text.findOne({
			to_number: to_number
		})
		.then(text => {
			console.log('getTextByPhoneNumber result: ' + text);
			if (!text) {
				return null;
			}
			return text;
		}).catch(err => {
			console.log('getTextByPhoneNumber error result:');
			console.log(err);
			return null;
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
			return null;
		});
}

async function updateTextById(text, message_id, resp) {
	console.log('>>>>> updateTextById with message_id: ' + message_id);
	text.message_id = message_id;
	console.log('>>>>> updateTextById with text after update: ' + JSON.stringify(text));
	await Text.findByIdAndUpdate(text._id, text, {
			new: true
		})
		.then(text => {
			if (!text) {
				return resp.status(404).send({
					message: "Text not found with id " + text._id
				});
			}
			res.send(text);
		}).catch(err => {
			if (err.kind === 'ObjectId') {
				return resp.status(404).send({
					message: "Text not found with id " + text._id
				});
			}
			return resp.status(500).send({
				message: `Error updating text with id ${text._id}: ${err.message}`
			});
		});
};

module.exports = {
	saveText,
	getTextByPhoneNumber,
	getTextByMessageId,
	updateTextById
};