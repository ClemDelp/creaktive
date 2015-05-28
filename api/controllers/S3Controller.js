/********** AMAZON S3 and CloudFront ********/


 module.exports = {

    uploadScreenshot : function(req,res){
        //console.log("uploading screenshot to S3")
       S3Service.pushFile(req.body.screenshot, function(err, data){
            if(err) return res.send({err:err});
            res.send(data)
        });
    },

    upload : function(req,res){  
        //console.log("uploading file to S3") 
       S3Service.pushFile(req.files[0], function(err, data){
            if(err) return res.send({err:err});
            res.send({amz_id : data})
        });
    },


    getUrl : function(req,res){
        //console.log('Get file S3 url')
        S3Service.getFile(req.query.amz_id, function(err, url){
            if(err) return res.send({err:err});
            res.type('png');
            res.redirect(url);
        })
    },


    deleteFile : function(req,res){
        //console.log('Deleting file from S3')
        S3Service.deleteFile(req.body.fileName, function(err, url){
            if(err) return res.send({err:err});
            res.send(url)
        })

    }

    

    

}