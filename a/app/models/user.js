var mongoose = require("mongoose");
var UserSchema = require('../schemas/user');
var User = mongoose.model('User', UserSchema);     //编译生成模型

module.exports = User;