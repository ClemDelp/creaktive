/********** AMAZON S3 and CloudFront ********/
var cloudfront = require('cloudfront');
var fs = require('fs');

 //Si erreur request has expired : changer l'heure de l'OS sur automatique
 var crypto = require('crypto');
 var AWS_ACCESS_KEY = process.env.AWSAccessKeyId || "AKIAJFDYWR6XAM4CBMCA";
 var AWS_SECRET_KEY = process.env.AWSSecretKey || "UsDohYM/hLOKvuUaB5VSiW7BcJieYVdBn8XuixvA";
 var S3_BUCKET = process.env.S3_BUCKET || "creaktivetest";


 module.exports = {



/**
  Possible argument combinations:
    1) hostname, path, expires, options

    2) hostname, path, expires
    3) url, expires, options
    4) hostname, path, options

    5) url, options
    6) expires, options
    7) url, expires

    8) options

*/

	getPrivateUrl : function (req,res){
 		var cf = cloudfront.createClient(AWS_ACCESS_KEY,AWS_SECRET_KEY);
		cf.keyPairId = process.env.AWS_CF_KEY_PAIR_ID ||"APKAINMRZ47Y6KNXIJQQ";
		cf.privateKey = fs.readFileSync("pk-"+cf.keyPairId+".pem");
 		
 		var now = new Date();
    	var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now

 		var hostname = process.env.AWS_CF_HOSTAME || "d2gsmu1q0g6u6n.cloudfront.net/" 
 		var path = req.query.path;
		
		var private_url = cf.getPrivateUrl(hostname, path, expires );
		res.send(private_url);
	},

 	sign_s3 : function(req,res){


 		var object_name = req.query.s3_object_name.replace(/-/g,"");;
 		var mime_type = req.query.s3_object_type;

 		var now = new Date();
    var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:private";

    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;


    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
    signature = encodeURIComponent(signature.trim());
    signature = signature.replace('%2B','+');

    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

    var credentials = {
    	signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
    	url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();
},

}