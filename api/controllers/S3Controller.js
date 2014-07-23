/********** AMAZON S3 and CloudFront ********/


 module.exports = {

    upload : function(req,res){
        
       sails.config.s3.pushFile(req.files[0], function(err, data){
            if(err) console.log(err);
            res.send(data)
        });

    },


    getUrl : function(req,res){
        sails.config.s3.getFile(req.body.fileName, function(err, url){
            if(err) res.send({err :err});
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