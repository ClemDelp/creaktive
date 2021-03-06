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

  // In-memory adapter for DEVELOPMENT ONLY
  memory: {
    module: 'sails-memory'
  },

  // Persistent adapter for DEVELOPMENT ONLY
  // (data IS preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },


  mongo: {
    module: 'sails-mongo',
    schema: false,
    url: JSON.parse(process.env.VCAP_SERVICES).mongolab[0].credentials.uri//'mongodb://IbmCloud_kt04o8sp_b7ckgfdf_sa6kbct9:T68KM_Mnbq8LJg_nODcYio1ZNJ9mpdjW@ds027613.mongolab.com:27613/IbmCloud_kt04o8sp_b7ckgfdf'
  },
  //

};