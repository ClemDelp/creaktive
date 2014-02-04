module.exports = function(req,res,next){
	var url = req.headers.referer;
	console.log(url)
	if(url ==="http://localhost:1337/") {
		next();
	}
	else{
		if(req.headers['x-forwarded-proto']!='https'){
			res.redirect(url.substring(0,url.length-1)+req.url)
		}
		else{
			next()
		}
	}

};