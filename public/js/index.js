/**
 * Created by 海带 on 2018/4/1.
 */

$(function() {

    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $userInfo = $("#userInfo");

    //当a被点击的时候 切换到注册面板
    $loginBox.find('a.colMint').on('click', function() {
        $registerBox.show();
        $loginBox.hide();
    });

    //切换到登录面板
    $registerBox.find('a.colMint').on('click', function() {
        $loginBox.show();
        $registerBox.hide();
    });

    // //注册
    $registerBox.find('button').on('click',function(){
         //通过ajax提交请求
         $.ajax({
             type:'post',
             url:'api/user/register',
             data:{
                 //input name
                 username:$registerBox.find('[name="username"]').val(),
                 password:$registerBox.find('[name="password"]').val(),
                 repassword:  $registerBox.find('[name="repassword"]').val()
             },
             dataType:'json',
             success:function(result){
                //   console.log(result);
                //注册信息显示到.colWarning中 显示到页面
                $registerBox.find('.colWarning').html(result.message);
                //code为0 表示成功
                if(!result.code){
                    //注册成功
                    //注册成之后 显示登录页面 隐藏注册页面
                    setTimeout(function(){
                        //显示登录页面
                        $loginBox.show();
                        //隐藏注册页面
                        $registerBox.hide();
                    },2000);
                }
             }
         });
    });
    // $registerBox.find('button').on('click', function() {
    //     //通过ajax提交请求
    //     $.ajax({
    //         type: 'post',
    //         url: '/api/user/register',
    //         data: {
    //             username: $registerBox.find('[name="username"]').val(),
    //             password: $registerBox.find('[name="password"]').val(),
    //             repassword:  $registerBox.find('[name="repassword"]').val()
    //         },
    //         dataType: 'json',
    //         success: function(result) {
    //             $registerBox.find('.colWarning').html(result.message);

    //             if (!result.code) {
    //                 //注册成功
    //                 setTimeout(function() {
    //                     $loginBox.show();
    //                     $registerBox.hide();
    //                 }, 1000);
    //             }

    //         }
    //     });
    // });

    //登录
    $loginBox.find('button').on('click', function() {
         //通过ajax提交请求
         $.ajax({
             type:'post',
             url:'/api/user/login',
             data:{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val(),
             },
             dataType:'json',
             success:function(result){
                $loginBox.find('.colWarning').html(result.message);

                //code为0 表示成功
                if(!result.code){
                    //登录成功
                    // setTimeout(function(){
                    //     //隐藏登录页面
                    //     $loginBox.hide();
                    //     //显示信息按钮
                    //     $userInfo.show();

                    //     //显示登录用户的信息
                    //     $userInfo.find('.username').html(result.userInfo.username);
                    //     $userInfo.find('.info').html('欢迎来到我的世界~~~');;
                    // },2000);
                    window.location.reload();
                }
             }
         });
    });

    // $loginBox.find('button').on('click', function() {
    //     //通过ajax提交请求
    //     $.ajax({
    //         type: 'post',
    //         url: '/api/user/login',
    //         data: {
    //             username: $loginBox.find('[name="username"]').val(),
    //             password: $loginBox.find('[name="password"]').val()
    //         },
    //         dataType: 'json',
    //         success: function(result) {

    //             $loginBox.find('.colWarning').html(result.message);

    //             if (!result.code) {
    //                 //登录成功
    //                 window.location.reload();
    //             }
    //         }
    //     })
    // })

    //退出
    $('#logout').on('click', function() {
        $.ajax({
            url:'/api/user/logout',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    })
    // $('#logout').on('click', function() {
    //     $.ajax({
    //         url: '/api/user/logout',
    //         success: function(result) {
    //             if (!result.code) {
    //                 window.location.reload();
    //             }
    //         }
    //     });
    // })

})