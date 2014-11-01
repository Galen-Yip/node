var mongoose = require("mongoose");
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie', MovieSchema);     //编译生成Moive模型

module.exports = Movie;