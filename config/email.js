
var nodemailer = require("nodemailer");

module.exports.email = {
	
	smtpTransport : nodemailer.createTransport("PICKUP",{
	    directory : "email/"
	}),


	sendRegistrationMail : function(to, text, cb){
		mailOptions = {
		    from: "CreaKtive ✔ contact@creaktive.fr", // sender address
		    to: to, // list of receivers
		    subject: "Invititation on CreaKtive", // Subject line
		    text: text, // plaintext body
		},

		this.smtpTransport.sendMail(mailOptions, function(error, response){
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