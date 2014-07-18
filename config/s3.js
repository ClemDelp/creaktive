//Libs
var AWS = require('aws-sdk');
var fs = require('fs');
//var
var S3_BUCKET = process.env.S3_BUCKET || "creaktivetest";
var AWS_CF_HOSTAME = process.env.AWS_CF_HOSTAME || "d2gsmu1q0g6u6n.cloudfront.net/";
var AWS_CF_KEY_PAIR_ID = process.env.AWS_CF_KEY_PAIR_ID ||"APKAINMRZ47Y6KNXIJQQ";
var AWS_PRIVATE_KEY = fs.readFileSync("pk-"+AWS_CF_KEY_PAIR_ID+".pem");

(function(){
	AWS.config.update({
		accessKeyId : process.env.AWSAccessKeyId || "AKIAIK5NKF7MSBBB4EGQ",
		secretAccessKey : process.env.AWSSecretKey || "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",
		region: 'us-west-1'
	});

}());




module.exports.s3 = {

	pushFile : function(file, cb){
		var data = {
			Bucket : S3_BUCKET,
			Key: guid(), 
			Body: file,
			ACL: "private",
		};
  		AWS.putObject(data, function(err, data) {
		    if (err) cb(err)
		    cb(null,data)    		      
	    });
	},

	deleteFile : function(file, cb){

	},

	getFile : function(file, cb){

	}


};