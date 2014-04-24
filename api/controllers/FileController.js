/**
 * FileController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
 function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
 function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}


 var fs = require('fs');
 var mkdirp = require('mkdirp');
 var rimraf = require('rimraf');

 // AMAZON S3
 var crypto = require('crypto');
 var AWS_ACCESS_KEY = "AKIAJFDYWR6XAM4CBMCA";
 var AWS_SECRET_KEY = "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";
 var S3_BUCKET = "creaktiverenault"
//var io = require('socket.io');

var UPLOAD_PATH = 'upload';


function safeFilename(name) {
	name = name.replace(/ /g, '-');
	name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
	name = name.replace(/\.+/g, '.');
	name = name.replace(/-+/g, '-');
	name = name.replace(/_+/g, '_');
	return name;
}

function fileMinusExt(fileName) {
	return fileName.split('.').slice(0, -1).join('.');
}

function fileExtension(fileName) {
	return fileName.split('.').slice(-1);
}

// Where you would do your processing, etc
// Stubbed out for now
function processImage(id, name, path, cb) {

	cb(null, {
		'result': 'success',
		'id': id,
		'name': name,
		'path': path
	});
}

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

  sign_s3 : function(req,res){

    var object_name = safeFilename(req.query.s3_object_name).replace(/-/g,"");;
    var mime_type = req.query.s3_object_type;

    var now = new Date();
    var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:public-read";

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

  get: function (req, res) {
  	res.download(req.query.path);
  },

  destroy : function (req,res){
   rimraf('upload/'+req.body.file.id, function(err) {
     if (err) { console.log( err); }
     res.send({msg:"destroyed"})
   })
 },

 upload: function(req, res) {
  console.log("tututututututututu",req.files)
  var file = req.files[0];

  async.auto({

    metadata : function(next){
      id = guid(),
      fileName = safeFilename(file.name),
      dirPath = UPLOAD_PATH + '/' + id,
      filePath = dirPath + '/' + fileName;

      next(null,{
        id: id,
        fileName : fileName,
        dirPath : dirPath,
        filePath : filePath
      })
    },

    writeFile : ["metadata", function(next, r){


      try {
        mkdirp.sync(dirPath, 0755);
      } catch (e) {
        console.log(e);
      }

      fs.readFile(file.path, function (err, data) {
        if (err) {
          res.json({'error': 'could not read file'});
        } else {
          fs.writeFile(r.metadata.filePath, data, function (err) {
            if (err) {
              res.json({'error': 'could not write file to storage'});
            } else {
              processImage(id, r.metadata.fileName, r.metadata.filePath, function (err, data) {
                if (err) {
                  res.json(err);
                } else {
                  res.json(data);
                  next()
                }
              });
            }
          })
        }
      });
    }]

  },function(err){
    if(err) res.send(err)
  })
},

};
