'use strict';
const express = require('express');
const swig = require('swig');
//加载数据库模块
const mongoose = require("mongoose");
//用来处理post提交过来的数据
const bodyParser = require('body-parser');
//加载cookie模块
const Cookies = require('cookies');
const app = express();
const User = require('./models/User');
//静态资源文件托管
app.use("/public",express.static(__dirname+ "/public"));
app.engine('html',swig.renderFile);
app.set('views',__dirname+'/views');
//注册所使用的模板引擎
app.set("view engine","html");
//开发过程中 需要清除模板缓存
swig.setDefaults({cache:false});

/*bodyParser中间件 */
app.use(bodyParser.urlencoded({extended:true}));

//设置cookies
app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);
    //解析登录用户的cookies信息
    //增加一个自定义属性
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取登录用户的类型 看是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
        } catch (error) {
            next();
        }
    }else{
        next();
    }
});

app.use('/admin',require("./routers/admin"));
app.use('/api',require("./routers/api"));
app.use('/',require("./routers/main"));

mongoose.connect('mongodb://localhost:27018/node_Blog',function(err){
    if(err){
        console.log('数据库链接失败');
    }else{
        console.log("数据库链接成功");
        //监听http请求
        app.listen(3000);
    }
});


