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
  'POST  /api/v1/account/login':                        { action: 'account/login' },
  'POST  /api/v1/account/signup':                       { action: 'account/signup' },
  'POST  /api/v1/account/password-reset':               { action: 'account/password-reset' },
  'POST  /api/v1/account/address/save':                 { action: 'account/address/save' },
  'POST  /api/v1/account/address/get':                  { action: 'account/address/get' },
  'POST  /api/v1/account/address/delete':               { action: 'account/address/delete' },
  'POST  /api/v1/otp/generate':                         { action: 'otp/generate' },
  'POST  /api/v1/otp/validate':                         { action: 'otp/validate' },
  'POST  /api/v1/homepageconfig/set-config':            { action: 'homepageconfig/set-config' },
  'POST  /api/v1/homepageconfig/get':                   { action: 'homepageconfig/get' },
  'POST  /api/v1/product/save':                         { action: 'product/save' },
  'POST  /api/v1/product/category':                     { action: 'product/category' },
  'POST  /api/v1/product/get':                          { action: 'product/get' },
  'POST  /api/v1/product/get-by-ids':                   { action: 'product/get-by-ids' },
  'POST  /api/v1/product/auto-suggest':                 { action: 'product/auto-suggest' },
  'POST  /api/v1/product/search':                       { action: 'product/search' },
  'POST  /api/v1/cart/update':                          { action: 'cart/update' },
  'POST  /api/v1/cart/state':                           { action: 'cart/state' },
  'POST  /api/v1/checkout/init':                        { action: 'checkout/init' },
  'POST  /api/v1/payment/init':                         { action: 'payment/init' },
  'POST  /api/v1/payment/update-status':                { action: 'payment/update-status' },
  'POST  /api/v1/orders/get':                           { action: 'orders/get' },
  'POST  /api/v1/orders/get-received-orders':           { action: 'orders/get-received-orders' },
  'POST  /api/v1/delivery-route/get':                   { action: 'delivery-route/get' },
  'POST  /api/v1/delivery-route/save':                  { action: 'delivery-route/save' },
  'POST  /api/v1/customers/get':                        { action: 'customers/get' },
  'POST  /api/v1/drivers/get':                          { action: 'drivers/get' },
  'POST  /api/v1/drivers/get-all':                      { action: 'drivers/get-all' },
  'POST  /api/v1/customers/update-status':              { action: 'customers/update-status' },
  'POST  /api/v1/orders/update-status':                 { action: 'orders/update-status' },
  'POST  /api/v1/driver/get-assigned-orders':           { action: 'driver/get-assigned-orders' },
  'POST  /api/v1/shop/add':                             { action: 'shop/add' },
  'POST  /api/v1/shop/edit':                            { action: 'shop/edit' },
  'POST  /api/v1/shop/update-status':                   { action: 'shop/update-status' },
  'POST  /api/v1/shop/get-all':                         { action: 'shop/get-all' },
  'POST  /api/v1/salesman/get-all':                     { action: 'salesman/get-all' },
  'POST  /api/v1/salesman/get-shops':                   { action: 'salesman/get-shops' },
  'POST  /api/v1/location/add':                         { action: 'location/add' },

};
