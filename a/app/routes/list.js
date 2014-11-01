var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');

router.get('/', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err)
		}else{
			res.render('list', { 
				title: 'welcome to Movie list',
				movies: movies
			})
		}
	})
});

router.delete('/', function(req, res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err)
			}else{
				res.json({success: 1})
			}
		})
	}
});

module.exports = router;