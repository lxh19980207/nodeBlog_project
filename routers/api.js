'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Content = require('../models/Content');

//统一返回格式
var responseData;
router.use(function(req,res,next){
  responseData={
    code:0,
    message:''
  }
  next();
});

/***用户注册逻辑  
 * 1.用户名不能为空
 * 2.密码不能为空
 * 3.两次密码不一致
 * 
 * 数据库查询:用户名是否已经注册
 */
router.post('/user/register',function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;

  //判断用户是否为空
  if(username == ''){
    responseData.code=1;
    responseData.message = "用户名不能为空";
    //错误结果返回给前端页面
    res.json(responseData);
    return;
  }
  //密码不能为空
  if(password == ''){
    responseData.code = 2;
    responseData.message = "密码不能为空";
    res.json(responseData);
    return;
  }
  //两次密码输入是否一致
  if(password != repassword){
    responseData.code = 3;
    responseData.message = "两次输入密码不一致";
    res.json(responseData);
    return;
  }

  //判断用户名是否已经注册(操作数据库)
  User.findOne({
    //判断是否已存在用户名 是否和注册的用户名相同
    username:username
  }).then(function(userInfo){
    if(userInfo){
      //数据库中有该记录 
      responseData.code = 4;
      responseData.message = "用户名已经注册";
      res.json(responseData);
      return;
    }
    //注册成功
    var user= new User({
      username:username,
      password:password
    });
    return user.save();
  }).then(function(newUserInfo){
    responseData.message = "注册成功";
    res.json(responseData);
  });
});

//登陆
router.post('/user/login',function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  if(username == '' || password == ''){
    responseData.code=1;
    responseData.message = "用户名和密码不能为空";
    //错误页面返回给前端页面
    res.json(responseData);
    return;
  }
  //查询数据库中相同用户名和密码是否存在  如果存在 则登录成功  不存在则报错
  User.findOne({
    username:username,
    password:password
  }).then(function(userInfo){
    if(!userInfo){
      responseData.code = 2;
      responseData.message = "用户名和密码有误";
      res.json(responseData);
      return;
    }
    //用户名密码正确 登陆成功
    responseData.message="登陆成功";
    //登陆成功后  返回用户信息
    responseData.userInfo={
      //id
      _id:userInfo._id,
      //用户名
      username:userInfo.username
    }
    //保存cookies
    req.cookies.set("userInfo",JSON.stringify({
      _id:userInfo._id,
      username:userInfo.username
    }));
    res.json(responseData);
    return;
  });
});

//退出的方法
router.get('/user/logout',function(req,res){
  req.cookies.set("userInfo",null);
  res.json(responseData);
});

//获取指定文章的所有评论
router.get('/comment',function(req,res){
  var contentid = req.query.contentid || '';
  Content.findOne({
    _id:contentid
  }).then(function(content){
    responseData.data = content.comments;
    res.json(responseData);
  });
});

//**评论提交 */
router.post('/comment/post',function(req,res){
   //内容id
   var contentid = req.body.contentid || '';
   var postData={
     //评论的用户名
     username:req.userInfo.username,
     //评论的时间
     postTime:new Date,
     //评论的内容
     content:req.body.content
   };
   //查询当前这篇内容的信息
   Content.findOne({
     _id:contentid
   }).then(function(content){
     content.comments.push(postData);
     return content.save();
   }).then(function(newContent){
     responseData.message="评论成功";
     responseData.data = newContent;
     res.json(responseData);
   });
});

module.exports = router;
