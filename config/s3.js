//Libs
var AWS = require('aws-sdk');
var fs = require('fs');
//var
var S3_BUCKET = process.env.S3_BUCKET || "creaktivetest2";
var AWS_CF_HOSTAME = process.env.AWS_CF_HOSTAME || "d2gsmu1q0g6u6n.cloudfront.net/";
var AWS_CF_KEY_PAIR_ID = process.env.AWS_CF_KEY_PAIR_ID ||"APKAINMRZ47Y6KNXIJQQ";
var AWS_PRIVATE_KEY = fs.readFileSync("pk-"+AWS_CF_KEY_PAIR_ID+".pem");

//functions
function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}




module.exports.s3 = {

	pushFile : function(file, cb){
		AWS.config.update({
			accessKeyId : process.env.AWSAccessKeyId || "AKIAIK5NKF7MSBBB4EGQ",
			secretAccessKey : process.env.AWSSecretKey || "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",
			region: 'eu-west-1'
		});
		var s3 = new AWS.S3();

		var bodyStream = fs.createReadStream(file.path);
		var data = {
			Bucket : S3_BUCKET,
			Key: guid().replace(/-/g,""), 
			Body: bodyStream,
			ACL: "private",
		};

  		s3.putObject(data, function(err, file) {
		    if (err) cb(err)
		    console.log("File ", data.Key)
		    cb(null,file)    		      
	    });
	},

	deleteFile : function(file, cb){
						AWS.config.update({
			accessKeyId : "AKIAIK5NKF7MSBBB4EGQ",
			secretAccessKey : "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",
			region: 'eu-west-1'
		});
		var s3 = new AWS.S3();
		var params = {
			Bucket: S3_BUCKET, // required
			Key: file, // required
		};
		s3.deleteObject(params, function(err, data) {
			if (err) cb(err); // an error occurred
			cb(null,data);           // successful response
		});
	},

	getFile : function(file, cb){
				AWS.config.update({
			accessKeyId : "AKIAIK5NKF7MSBBB4EGQ",
			secretAccessKey : "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",
			region: 'eu-west-1'
		});
		var s3 = new AWS.S3();
		var params = {
			Bucket: S3_BUCKET, // required
			Key: file, // required
			Expires: 60
		}

		s3.getSignedUrl('getObject', params, function (err, url) {
		  			if (err) cb(err); // an error occurred
			console.log(url)
			cb(null,url);           // successful response
		});
	}


};