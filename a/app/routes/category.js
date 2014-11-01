var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Category = require('../models/category');

/*分类相关*/
router.get('/', function(req, res){
	res.render('category_admin', {
		title: '后台分类添加页',
		category: {
			name: ''
		}
	})
});

router.get('/list', function(req, res){
	Category.fetch(function(err, categories){
		if(err){
			console.log(err)
		}

		res.render('category_list', {
			title: '分类列表',
			categories: categories
		})
	})
});

router.delete('/list', function(req, res){
	var id = req.query.id;

	if(id){
		Category.remove({_id: id}, function(err, category){
			if(err){
				console.log(err)
			}else{
				res.json({success: 1})
			}
		})
	}
});

router.get('/update/:id', function(req, res){
	var id = req.params.id;
	if(id){
		Category.findById( id, function(err, category){
			res.render('category_admin', {
				title: '后台分类添加页',
				category: category
			})
		})
	}	
});

router.post('/new', function(req, res){
	var id = req.body.category._id;
	var cateObj = req.body.category;
	var _cate;
	
	if(id !== 'undefined'){
		Category.findById( id, function(err, category){
			if(err){
				console.log(err)
			}

			_cate = _.extend(category, cateObj);
			_cate.save(function(err, category){
				if(err){
					console.log(err)
				}else{
					res.redirect('/admin/category/list')
				}
			})
		})
	}else{
		var category = new Category({
			name: cateObj.name
		});

		category.save(function(err, category){
			if(err){
				console.log(err);
			}else{
				res.redirect('/admin/category/list');
			}
		})

	}
});

module.exports = router;
