/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  '/terms':                   '/legal/terms',
  '/logout':                  '/api/v1/account/logout',


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.
  // '/api/v1/account/logout':                           { action: 'account/logout' },
  // 'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  'POST   /api/v1/account/login':                        { action: 'account/login' },
  'POST  /api/v1/account/signup':                        { action: 'account/signup' },
  'POST  /api/v1/account/password-reset':                { action: 'account/password-reset' },
  'POST  /api/v1/account/address/save':                  { action: 'account/address/save' },
  'POST  /api/v1/account/address/get':                  { action: 'account/address/get' },
  'POST  /api/v1/otp/generate':                          { action: 'otp/generate' },
  'POST  /api/v1/otp/validate':                          { action: 'otp/validate' },
  'POST  /api/v1/homepageconfig/set-config':             { action: 'homepageconfig/set-config' },
  'POST   /api/v1/homepageconfig/get':                   { action: 'homepageconfig/get' },
  'POST   /api/v1/product/save':                         { action: 'product/save' },
  'POST   /api/v1/product/category':                     { action: 'product/category' },
  'POST   /api/v1/product/get':                          { action: 'product/get' },
  'POST   /api/v1/product/get-by-ids':                   { action: 'product/get-by-ids' },
  'POST   /api/v1/product/auto-suggest':                 { action: 'product/auto-suggest' },
  'POST   /api/v1/product/search':                       { action: 'product/search' },
  'POST   /api/v1/cart/update':                          { action: 'cart/update' },
  'POST   /api/v1/cart/state':                          { action: 'cart/state' },

};
