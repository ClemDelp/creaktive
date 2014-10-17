//Libs
var AWS = require('aws-sdk');
var fs = require('fs');
//var
var S3_BUCKET = process.env.S3_BUCKET || "creaktivetest2";
var AWS_CF_HOSTAME = process.env.AWS_CF_HOSTAME || "d2gsmu1q0g6u6n.cloudfront.net/";
var AWS_CF_KEY_PAIR_ID = process.env.AWS_CF_KEY_PAIR_ID ||"APKAINMRZ47Y6KNXIJQQ";
var AWS_PRIVATE_KEY = fs.readFileSync("pk-"+AWS_CF_KEY_PAIR_ID+".pem");



module.exports = {

	pushFile : function(file, cb){
		AWS.config.update({
			accessKeyId : process.env.AWSAccessKeyId || "AKIAIK5NKF7MSBBB4EGQ",
			secretAccessKey : process.env.AWSSecretKey || "8ilJspyQbm6/jeznjCvT0xVtfhdWkgVl1/dAnwOU",
			region: 'eu-west-1'
		});
		var s3 = new AWS.S3();
		var body = {};
		var key = file.name || IdService.guid().replace(/-/g,"");
		console.log("Sending " + key + " to S3");
		if(file.path)  body = fs.createReadStream(file.path);
		else{
			//Convertit en image et enregistre sur le serveur cf. FileController
			body = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""),'base64')
			//body = file;
		}

		var data = {
			Bucket : S3_BUCKET,
			Key: key, 
			Body: body,
			ACL: "private",
		};

  		s3.putObject(data, function(err, file) {
		    if(err) return cb(err)
		    console.log("File pushed on s3", data.Key)
		    // cb(null,data.Key)    		      
	    });
	    cb(null,key)
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
		console.log(file)
				AWS.config.update({
			accessKeyId : "AKIAIK5NKF7MSBBB4EGQ",
			secretAccessKey : "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",
			region: 'eu-west-1'
		});
		var s3 = new AWS.S3();
		var params = {
			Bucket: S3_BUCKET, // required
			Key: file, // required
		}

		s3.getSignedUrl('getObject', params, function (err, url) {
		  			if (err) cb(err); // an error occurred

			cb(null,url);           // successful response
		});
	}


};