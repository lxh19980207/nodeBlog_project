'use strict';

const mongoose = require('mongoose');
const cetegoriesSchema = require('../schemas/categories');
module.exports = mongoose.model('Category',cetegoriesSchema);