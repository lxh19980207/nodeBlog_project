/*定义好数据结构 */
'use strict';

const mongoose = require('mongoose');

//用户表结构
module.exports = new mongoose.Schema({
    username:String,
    password:String,
    //增加一个管理员字段
    isAdmin:{
        type:Boolean,
        default:false
    }
});