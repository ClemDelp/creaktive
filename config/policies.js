/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


 module.exports.policies = {

  // Default policy for all controllers and actions
  // (`true` allows public access) 
  

  '*': false,

  'AuthController': {
    'login' : "forceHTTPs",
    'logout' : true,
    'process' : true,
    'registernew' : true,
    'processRegistrationNew' : true,
    'register' : "forceHTTPs",
    'resetpassword' : true,
    'processResetPassword' : true,
    'newpassword' : true,
    'processnewpassword' : true,
    'processRegistration' : true,
    "openChannels" : ["authenticated"]
  },

  "SparqlController" : {
    "*" : "authenticated"
  }, 

  "ElasticsearchController" : {
    "*" : "authenticated"
  }, 

  "ContactController" : {
    "*" : "authenticated"
  }, 

  "CkviewerController" : {
   "ckviewerview" : ["authenticated", "allowedProjects","forceHTTPs"],
   "*" : "authenticated"
  },

  "PocheController" : {
    "find" : ["authenticated", "canRead"],
    "*" : ["authenticated", "canWrite"]
  },

  "FileController" : {
    "*" : "authenticated"
  },
  
  "CkpreviewerController" : {
    "ckpreviewerview" :["authenticated", "allowedProjects","forceHTTPs"],
    "*" : "authenticated"
  }, 


  "AnalyseController" : {
    "*" : "authenticated"
  },

  "S3Controller" : {
    "*" : "authenticated"
  },

  "bbmap" : {
    "screenshot" : true,
    "*" : ["authenticated", "allowedProjects"],
  },


  "LinkController" : {
    "find" : ["authenticated", "canRead"],
    "*" : ["authenticated", "canWrite"]
  },

  "ProjectController" : {
    "*" : "authenticated",
    "destroy" : ["authenticated", "canRemoveProject" ],

  }, 

  "NotificationController" : {
    "notificationview" : ["authenticated", "allowedProjects","forceHTTPs"],
    "*" : ["authenticated"],
  },

  "PermissionController" : {
    "find" : ["authenticated", "canRead"],
    "*" : ["authenticated", "canManageUsers"]
  },

  /*********** VIEWS ******************/
  "ManagerController" : {
    "managerview" : ["authenticated", "allowedProjects","forceHTTPs"],
    "editprofileview" : ["authenticated", "forceHTTPs"],
    "find" : ["authenticated", "canRead"],
    "*" : ["authenticated", "canWrite"]
  },

  "UserController" : {
    "*" : ["authenticated", "canWrite"],
    "inviteUser" : ["authenticated"],
    "userview" : ["authenticated", "allowedProjects","forceHTTPs"],
    "editprofileview" : ["authenticated", "forceHTTPs"],
    "editprofile" : "authenticated",
    "changepassword" :"authenticated",
    "find" : ["authenticated", "canRead"],
  },

  "AnalyseController" : {
    "analyseview" : ["authenticated", "allowedProjects","forceHTTPs"],
  }, 

  "ConceptController" : {
    "conceptview" : ["authenticated", "allowedProjects","forceHTTPs"],
    "find" : ["authenticated", "canRead"],
    "generateTree" : ["authenticated", "canRead"],
    "*" : ["authenticated", "canWrite"] 
  },

  "KnowledgeController" : {
    "knowledgeview" : ["authenticated", "allowedProjects","forceHTTPs"],
    "find" : ["authenticated", "canRead"],
    "*" : ["authenticated", "canWrite"]
  },

  "BackupController" : {
    "*" : ["authenticated"]
  },

  "CategoryController" : {
    "categoryview" : ["authenticated", "allowedProjects","forceHTTPs"],
    "find" : ["authenticated", "canRead"],
    "*" : ["authenticated", "canWrite"]
  },

  "ScreenshotController" : {
    "*" : ["authenticated"]
  },

  "PresentationController" : {
    "*" : ["authenticated"]
  },

  "SlideController" : {
    "*" : ["authenticated"]
  },

  "BackupController" : {
    "*" : ["authenticated", "allowedProjects","forceHTTPs"]
  }
  /*
  // Here's an example of adding some policies to a controller
  RabbitController: {

    // Apply the `false` policy as the default for all of RabbitController's actions
    // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
    '*': false,

    // For the action `nurture`, apply the 'isRabbitMother' policy 
    // (this overrides `false` above)
    nurture : 'isRabbitMother',

    // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
    // before letting any users feed our rabbits
    feed : ['isNiceToAnimals', 'hasRabbitFood']
  }
  */
};


/**
 * Here's what the `isNiceToAnimals` policy from above might look like:
 * (this file would be located at `policies/isNiceToAnimals.js`)
 *
 * We'll make some educated guesses about whether our system will
 * consider this user someone who is nice to animals.
 *
 * Besides protecting rabbits (while a noble cause, no doubt), 
 * here are a few other example use cases for policies:
 *
 *  + cookie-based authentication
 *  + role-based access control
 *  + limiting file uploads based on MB quotas
 *  + OAuth
 *  + BasicAuth
 *  + or any other kind of authentication scheme you can imagine
 *
 */

/*
module.exports = function isNiceToAnimals (req, res, next) {
  
  // `req.session` contains a set of data specific to the user making this request.
  // It's kind of like our app's "memory" of the current user.
  
  // If our user has a history of animal cruelty, not only will we 
  // prevent her from going even one step further (`return`), 
  // we'll go ahead and redirect her to PETA (`res.redirect`).
  if ( req.session.user.hasHistoryOfAnimalCruelty ) {
    return res.redirect('http://PETA.org');
  }

  // If the user has been seen frowning at puppies, we have to assume that
  // they might end up being mean to them, so we'll 
  if ( req.session.user.frownsAtPuppies ) {
    return res.redirect('http://www.dailypuppy.com/');
  }

  // Finally, if the user has a clean record, we'll call the `next()` function
  // to let them through to the next policy or our controller
  next();
};
*/
