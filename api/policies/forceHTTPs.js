function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https')
      res.redirect('https://creaktive.herokuapp.com/'+req.url)
    else
      next() /* Continue to other routes if we're not redirecting */
  }