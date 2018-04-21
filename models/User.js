'use strict';

const mongoose = require('mongoose');
const userSchema = require('../schemas/users');

module.exports = mongoose.model("User",userSchema);