
var nodemailer = require("nodemailer");

module.exports.email = {
	
	smtpTransport : nodemailer.createTransport("PICKUP",{
	    directory : "email/"
	}),

	smtpGmail : nodemailer.createTransport("SMTP", {
	    service: "Gmail",
	    auth: {
	        user: "creaktive.contact@gmail.com",
	        pass: "creaktive30"
	    }
	}),


	sendRegistrationMail : function(to, url, cb){
		var html = "<h1>SALUT CONNARD</h1></br>ça te dirais te te connecter à mon projet ? </br>" + url

		mailOptions = {
		    from: "CreaKtive ✔ contact@creaktive.fr", // sender address
		    to: to, // list of receivers
		    subject: "Invititation on CreaKtive", // Subject line
		    generateTextFromHTML: true,
		    html: html, // plaintext body
		},

		this.smtpGmail.sendMail(mailOptions, function(error, response){
		    if(error){
		        cb(error)
		    }else{
		        cb(null, "Message sent: " + response.message);
		    }
		    // if you don't want to use this transport object anymore, uncomment following line
		    //smtpTransport.close(); // shut down the connection pool, no more messages
		});
	}





}