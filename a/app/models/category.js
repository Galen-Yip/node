var mongoose = require("mongoose");
var CateSchema = require('../schemas/category');
var Category = mongoose.model('Category', CateSchema);     //编译生成Category模型

module.exports = Category;