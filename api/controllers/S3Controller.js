/********** AMAZON S3 and CloudFront ********/


 module.exports = {

    upload : function(req,res){
        console.log(req.files[0])
        sails.config.s3.upload(req.files[0], function(err, data){
            if(err) res.send({err :err});
            res.send(data)
        });
    },

    getUrl : function(req,res){

        sails.config.geturl(req.body.fileName, function(err, url){
            if(err) res.send({err :err});
            res.send(url)
        })
    }

    

    

}