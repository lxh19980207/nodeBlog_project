/*定义好数据结构 */
'use strict';

const mongoose = require('mongoose');
//分类的表结构
module.exports = new mongoose.Schema({
    name:String
});