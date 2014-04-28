/**
 * FileController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
 function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
 function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}

/********** FILE UPLOAD ********/

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
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
};

function cleanName(name){
  return name.replace(/[ùûü]/g,"u").replace(/[îï]/g,"i").replace(/[àâä]/g,"a").replace(/[ôö]/g,"o").replace(/[éèêë]/g,"e").replace(/ç/g,"c").replace(/ /g,"");
}

module.exports = {

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
