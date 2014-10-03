module.exports = function(req,res,next){
	//return next()
		var u = req.baseUrl.replace("http","https");

	if(req.baseUrl == "http://localhost:1337" ||req.baseUrl == "http://localhost:5000"  ){
		next()
	} 
	else{
	    if(req.headers['x-forwarded-proto']!='https'){
	    	var u = req.baseUrl.replace("http","https");
	    	u = u.slice(0, u.lastIndexOf(":"))
			res.redirect(u+req.url)
	    }
	    else{
	      next() /* Continue to other routes if we're not redirecting */
		}
	}

  };