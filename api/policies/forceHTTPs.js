module.exports = function(req,res,next){
	console.log(req.baseUrl, req.url )
	if(req.baseUrl == "http://localhost:1337"){
		next()
	} 
	else{
		    if(req.headers['x-forwarded-proto']!='https')
      res.redirect(req.baseUrl.replace("http","https")+req.url)
    else
      next() /* Continue to other routes if we're not redirecting */
	}

  };