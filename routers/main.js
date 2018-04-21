'use strict';
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Content = require('../models/Content');
var data;
//通用中间件 处理通用数据
router.use(function(req,res,next){
  data={
    userInfo:req.userInfo,
    categories:[]
  }

  Category.find().then(function(categories){
    data.categories = categories,
    next();
  });
});


/**首页 */
router.get('/',function(req,res,next){
   data.count = 0;
   data.category = req.query.category || '';
   data.page = Number(req.query.page || 1);
   data.limit = 10;
   data.pages = 0;
   
   var where = {};
   if(data.category){
     where.category = data.category
   }

   //读取所有的分类信息
   Content.where(where).count().then(function(count){
     data.count = count;
     //计算总页数
     data.pages = Math.ceil(data.count/data.limit);
     //取值不能超过pages
     data.page = Math.min(data.page,data.pages);
     //取值不能小于1
     data.page = Math.max(data.page,1);

     var skip = (data.page - 1) * data.limit;

     return Content.where(where).find().limit(data.limit).sort({addTime:-1}).skip(skip).populate(['category','user']);
   
  }).then(function(contents){
     data.contents = contents;
     res.render('main/index',data);
   });

});

//阅读全文
router.get('/view',function(req,res){
  var contentid = req.query.contentid || '';
  Content.findOne({
    _id:contentid
  }).then(function(content){
    data.content = content;
    //阅读数++1
    content.views++;
    content.save();

    res.render('main/view',data);
  });
});

module.exports = router;