var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Movie = require('../models/movie');
var User = require('../models/user');
var Category = require('../models/category');
var fs = require('fs');
var path = require('path');

router.post('/', function(req, res){
	var id= req.body.movie._id;
	var categoryName= req.body.movie.categoryName;
	var movieObj = req.body.movie;
	var _movie;

	if(req.poster){
		movieObj.poster = req.poster;
	}

	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err)
				}else{
					res.redirect('/movie/' + movie._id)
				}
			})
		})
	}else{
		
		_movie = new Movie( movieObj );

		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}

			if(categoryName){
				var _cate = new Category({
					name: categoryName,
					movies: [movie._id]
				}); 
				_cate.save(function(err, category){

					console.log('新建了一个分类');

					movie.category = category._id;
					movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id);
					})
				})
					
			}else{
				var cid = movieObj.category;
				
				Category.findById( cid, function(err, category){
					category.movies.push(movie._id);

					category.save(function(err, category){
						if(err){
							console.log(err)
						};
					});

					res.redirect('/movie/' + movie._id);
							
				});
			}


			
		})
	}
});

router.savePoster = function(req, res ,next){
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;

	console.log(req.files)
	if(originalFilename){
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;

			var newPath = path.join(__dirname, '../..', '/_public/upload/' + poster)

			fs.writeFile(newPath, data, function(err){
				req.poster = poster;
				next()		
			})
		})
	}else{
		next()
	}
};

module.exports = router;
