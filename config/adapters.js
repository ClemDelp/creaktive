/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': 'mongo',

  // In-memory adapter for DEVELOPMENT ONLY
  memory: {
    module: 'sails-memory'
  },

  // Persistent adapter for DEVELOPMENT ONLY
  // (data IS preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  // MySQL is the world's most popular relational database.
  // Learn more: http://en.wikipedia.org/wiki/MySQL
  mysql: {

    module: 'sails-mysql',
    host: 'localhost',
    user: 'root',
    // Psst.. You can put your password in config/local.js instead
    // so you don't inadvertently push it up if you're using version control
    password: 'root', 
    database: 'creaktive'
  },

  mongo: {
    module: 'sails-mongo',
    schema: false,
    url: 'mongodb://IbmCloud_kt04o8sp_n940r6ij_lc90kbh1:svuVN24eox4yLz5PQgj0Q6SZfmWAHLDs@ds041190.mongolab.com:41190/IbmCloud_kt04o8sp_n940r6ij'//process.env.MONGOLAB_URI ||process.env.MONGOHQ_URL || 'mongodb://localhost:27017/creaktive'
  },
  //

};