var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');

router.post('/new', function(req, res){
	var commentObj = req.body.comment;
	var movieId = commentObj.movie
	var _comment;

	if(commentObj.cid){
		Comment.findById(commentObj.cid, function(err, comment){

			var reply = {
				from: commentObj.from,
				to: commentObj.tid,
				content: commentObj.content
			}

			comment.reply.push(reply);

			comment.save(function(err, comment){
				if(err){
					console.log(err);
				}else{
					res.redirect('/movie/' + movieId)
				}
			})
		})
	}else{
		_comment = new Comment( commentObj );

		_comment.save(function(err, comment){
			if(err){
				console.log(err);
			}else{
				res.redirect('/movie/' + movieId)
			}
		})
	}

	
});

module.exports = router;