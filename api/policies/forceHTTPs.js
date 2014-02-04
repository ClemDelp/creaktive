module.exports = function(req,res,next){
	var url = req.headers.referer;
	if(url != "http://localhost:1337/"){
		if(req.headers['x-forwarded-proto']!='https'){
			res.redirect(url.substring(0,url.length-1)+req.url)
		}
		else
			next()
	}
	else
		next() /* Continue to other routes if we're not redirecting */
};