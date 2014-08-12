/********** AMAZON S3 and CloudFront ********/


 module.exports = {

    uploadScreenshot : function(req,res){
       S3Service.pushFile(req.body.screenshot, function(err, data){
            if(err) console.log("here",err);
            res.send(data)
        });
    },

    upload : function(req,res){   
       S3Service.pushFile(req.files[0], function(err, data){
            if(err) console.log(err);
            console.log(typeof data)
            res.send({amz_id : data})
        });
    },


    getUrl : function(req,res){
        S3Service.getFile(req.query.amz_id, function(err, url){
            if(err) res.send({err :err});
            res.type('png');
            res.redirect(url);
        })
    },

    deleteFile : function(req,res){
        S3Service.deleteFile(req.body.fileName, function(err, url){
            if(err) res.send({err :err});
            res.send(url)
        })

    }

    

    

}