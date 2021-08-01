const mongoose = require('mongoose');

const TextSchema = mongoose.Schema({
    to_number: String,
    message: String,
    callback_url: String,
    status: String,
    message_id: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Text', TextSchema);