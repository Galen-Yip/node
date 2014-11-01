var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	role: {
		type: Number,
		default: 0
	},
	meta: {
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type: Date,
			default: Date.now()
		}	
	}
});

UserSchema.pre('save', function(next){
	var user = this;

	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	};

	
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err){
			return next(err)
		}

		bcrypt.hash(user.password, salt,  function(){},function(err, hash){
			if(err){
				return next(err)
			}

			user.password = hash;
			next()
		})
	})

});

UserSchema.methods = {   //实例方法，通过实例可以调用的方法
	comparePassword: function(_password, cb){
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if(err){
				return cb(err)         //如果有错误，把错误返回到回调中
			}else{
				cb(null, isMatch)
			}
		})
	}
}

UserSchema.statics = {
	fetch: function(cb){
		return this
			.find({})     //这两个是mongodb的查询方法
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb){
		return this
			.findOne({_id: id})   //这两个是mongodb的查询方法
			.exec(cb)
	}
}

module.exports = UserSchema;