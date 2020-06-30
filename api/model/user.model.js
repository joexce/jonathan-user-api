const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    userName: String,
    accountNumber: String,
    emailAddress: String,
    identityNumber: String
});

module.exports = mongoose.model('user', UserSchema);