var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Movie = require('../models/movie');
var User = require('../models/user');
var Category = require('../models/category');

/*电影相关*/
router.get('/', function(req, res){
	Category.find({}, function(err, categories){
		res.render('admin', { 
			title: 'welcome to admin add movie',
			categories: categories,
			movie: {
				title: '',
				director: '',
				categoryName: '',
				country: '',
				language: '',
				poster: '',
				summary: '',
			}
		})
	})
});

router.get('/update/:id', function(req, res){
	var id = req.params.id;

	if(id){
		Category.find({}, function(err, categories){

			Movie.findById(id, function(err, movie){
				res.render('admin', { 
					title: 'admin update movie',
					categories: categories,
					movie: movie
				})
			})
		})
	}
	
});


/*用户相关*/
router.get('/userlist', function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err)
		}else{
			res.render('userlist', {
				title: 'user list',
				users: users
			})
		}
	})
});

router.delete('/userlist', function(req, res){
	var id = req.query.id;

	if(id){
		User.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err)
			}else{
				res.json({success: 1})
			}
		})
	}
})

router.signinRequired = function(req, res ,next){
	var _user = req.session.user;

	if(!_user){
		console.log('please login')
		return res.redirect('/user/showsignin')
	}

	next()
};

router.adminRequired = function(req, res ,next){
	var _user = req.session.user;

	if(_user.role < 10 ){
		console.log('权限不够');
		return res.redirect('/user/showsignin')
	}

	next()
}

module.exports = router;