/********** AMAZON S3 and CloudFront ********/


 module.exports = {

    uploadScreenshot : function(req,res){
       sails.config.s3.pushFile(req.body.screenshot, function(err, data){
            if(err) console.log("here",err);
            res.send(data)
        });
    },

    upload : function(req,res){   
       sails.config.s3.pushFile(req.files[0], function(err, data){
            if(err) console.log(err);
            console.log(typeof data)
            res.send({amz_id : data})
        });
    },


    getUrl : function(req,res){
        console.log(req.query)
        sails.config.s3.getFile(req.query.amz_id, function(err, url){
            if(err) res.send({err :err});
            res.type('png');
            res.send(url)
        })
    },

    deleteFile : function(req,res){
        sails.config.s3.deleteFile(req.body.fileName, function(err, url){
            if(err) res.send({err :err});
            res.send(url)
        })

    }

    

    

}