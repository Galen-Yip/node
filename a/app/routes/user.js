var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/showsignup', function(req, res){
	res.render('showsignup', {
		title: '用户注册'
	})
});

router.get('/showsignin', function(req, res){
	res.render('showsignin', {
		title: '用户登陆'
	})
});

router.post('/signup', function(req, res){
	var _user = req.body.user;
	// req.params.user  一般是获取地址栏 : 参数的
	// ?后面一般是用 req.query获取
	// req.body一般是获取表单提交的
	// params是3种的集合


	User.findOne({name: _user.name}, function(err, user){
		if(err){
			console.log(err)
		}

		if (user) {
			console.log('已存在');
			res.redirect('/user/showsignin')
		}
		else{
			var user = new User(_user);
			user.save(function(err, user){
				if(err){
					console.log(err)
				}

				res.redirect('/admin/userlist')
			})
		}
	})
});

router.post('/signin', function(req, res){
	var _user = req.body.user,
		name = _user.name,
		password = _user.password;

	User.findOne({name: name}, function(err, user){
		if(err){
			console.log(err)
		}

		if(user){
			user.comparePassword(password, function(err, isMatch){
				if(err){
					console.log(err)
				}

				if(isMatch){
					req.session.user = user;
					res.redirect('/');
				}else{
					console.log('password is not matched ');
					res.redirect('/user/showsignin');
				}
			})
		}else{
				console.log('不存在该账号');
				res.redirect('/user/showsignup');
		}
	})
});

router.get('/logout', function(req, res){

	delete req.session.user
	res.redirect("/");
});

module.exports = router;


