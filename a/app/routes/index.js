var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Category = require('../models/category');

router.get('/', function(req, res){
	console.log(req.session.user);

	Category
		.find({})
		.populate({ 
			path: 'movies', 
			options: { limit: 5}
		})
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}else{
				res.render('index', { 
					title: 'welcome to index',
					categories: categories
				})
			}

		})
});

router.get('/results', function(req, res){
	var cid = req.query.cat;
	var page = req.query.p || 0;
	var q = req.query.q;
	var count = 2
	var index = page*count;   //这个是表明从哪条记录开始查

	if( cid){
		Category
			.find({ _id: cid})
			.populate({ 
				path: 'movies'
			})
			.exec(function(err, categories){
				if(err){
					console.log(err);
				}else{

					var category = categories[0] || {};
					var movies = category.movies || [];
					var results = movies.slice(index, index+ count);

					res.render('results', { 
						title: '结果列表',
						keyword: category.name,
						currentPage: (+page + 1),
						totalPage: Math.ceil(movies.length / count),
						query: 'cat=' + cid,
						movies: results
					})
				}

			})
	}
	else{
		Movie.find({ title: new RegExp( q + '.*', 'i')}, function(err, movies){
			if(err){
				console.log(err)
			}else{
				var results = movies.slice(index, index+ count);

				res.render('results', { 
					title: '结果列表',
					keyword: q,
					currentPage: (+page + 1),
					totalPage: Math.ceil(movies.length / count),
					query: 'q=' + q,
					movies: results
				})
			}
		})
	}
})

module.exports = router;