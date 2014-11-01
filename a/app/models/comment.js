var mongoose = require("mongoose");
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment', CommentSchema);     //编译生成Comment模型

module.exports = Comment;