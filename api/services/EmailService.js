
var nodemailer = require("nodemailer");

module.exports = {

	smtpGmail : nodemailer.createTransport("SMTP", {
        host: "smtp.gmail.com", // hostname
	    secureConnection: true, // use SSL
	    port: 465, // port for secure SMTP
	    auth: {
	        user:  "creaktive.contact@gmail.com",
	        pass:  "MichelTelo30"
	    }
	}),
	

	smtpTransport : nodemailer.createTransport("SMTP", {
        service: "Mailgun",
	    auth: {
	        user: process.env.MAILGUN_SMTP_LOGIN ,
	        pass: process.env.MAILGUN_SMTP_PASSWORD
	    }
	}),
	
	smtpMailgun : nodemailer.createTransport("SMTP", {
		service : "Mailgun",
		auth:{
			user : "postmaster@app21719684.mailgun.org",
			pass: "9s1fo0ikwr10"
		}
	}),


	sendRegistrationMail : function(to, url, cb){
		console.log("Sending registration mail")
		var html = "<h1>Bonjour</h1></br>Vous avez reçu une invitation sur CreaKtive</br> " + url
		mailOptions = {
		    from: "CreaKtive ✔ contact@creaktive.fr", // sender address
		    to: to, // list of receivers
		    subject: "Invititation on CreaKtive", // Subject line
		    generateTextFromHTML: true,
		    html: html, // plaintext body
		};

		var transport = this.smptMailgun;
		if(process.env.MAILGUN_SMTP_SERVER) transport = this.smtpTransport

		transport.sendMail(mailOptions, function(error, response){
		    if(error){
		        cb(error)
		    }else{
		        cb(null, "Message sent: " + response.message);
		    }
		    // if you don't want to use this transport object anymore, uncomment following line
		    //smtpTransport.close(); // shut down the connection pool, no more messages
		});
	},

	sendNewUserMail : function (user, cb){
		console.log("Sending invitation")
		var html = "New user added on CreaKtive " + user.name + " " + user.email;  
		var APP_NAME = process.env.APP_NAME || "local"
		mailOptions = {
		    from: "CreaKtive ✔ contact@creaktive.fr", // sender address
		    to: "creaktive.contact@gmail.com",
		    subject: "New user on CreaKtive (" + APP_NAME + ")" , // Subject line
		    generateTextFromHTML: true,
		    html: html, // plaintext body
		};

		var transport = this.smptMailgun;
		if(process.env.MAILGUN_SMTP_SERVER) transport = this.smtpTransport

		transport.sendMail(mailOptions, function(error, response){
		    if(error){
		        cb(error)
		    }else{
		        cb(null, "Message sent: " + response.message);
		    }
		    // if you don't want to use this transport object anymore, uncomment following line
		    //smtpTransport.close(); // shut down the connection pool, no more messages
		});

	},

	sendPasswordRecovery : function(to,url,cb){
		console.log("Send password recovery email")
		var html = "<h1>Bonjour</h1></br>Veuillez suivre le lien suivant pour créer un nouveau mot de passe</br> " + url;
		mailOptions = {
		    from: "CreaKtive ✔ contact@creaktive.fr", // sender address
		    to: to, // list of receivers
		    subject: "Password recovery", // Subject line
		    generateTextFromHTML: true,
		    html: html, // plaintext body
		};

		var transport = this.smptMailgun;
		if(process.env.MAILGUN_SMTP_SERVER) transport = this.smtpTransport

		transport.sendMail(mailOptions, function(error, response){
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