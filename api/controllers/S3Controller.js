/********** AMAZON S3 and CloudFront ********/


 module.exports = {

    upload : function(req,res){
        console.log(req.files[0])
        sails.config.s3.pushFile(req.files[0], function(err, data){
            if(err) res.send(err);
            res.send(null,data)
        });
    },

    getUrl : function(req,res){

        sails.config.geturl(req.body.fileName, function(err, url){
            if(err) res.send({err :err});
            res.send(url)
        })
    }

    

    

}