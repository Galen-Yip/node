var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Comment = require('../models/comment');

router.get('/:id', function(req, res){
	var id = req.params.id;

	Movie.update({ _id: id}, {$inc: {pv: 1}}, function(err){
		if(err){
			console.log(err)
		}
	});

	Movie.findById(id, function(err, movie){
		Comment
		.find({movie: id})        //??movie这里是为什么
		.populate('from', 'name')
		.populate('reply.from reply.to', 'name')
		.exec(function(err, comments){
			res.render('detail', { 
				title: 'welcome to Movie detail ' + movie.title ,
				movie: movie,
				comments: comments
			});

			
		})
	});

	

	
});

module.exports = router;