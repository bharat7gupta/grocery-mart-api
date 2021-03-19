/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': 'is-logged-in',

  // Bypass the `is-logged-in` policy for:
  'account/signup': true,
  'account/login': true,
  'account/logout': true,
  'account/password-reset': true,
  'account/address/save': 'is-logged-in',
  'account/address/get': 'is-logged-in',
  'account/address/delete': 'is-logged-in',
  'otp/*': true,
  'view-homepage-or-redirect': true,
  'view-faq': true,
  'view-contact': true,
  'legal/view-terms': true,
  'legal/view-privacy': true,
  'deliver-contact-form-message': true,
  'homepageconfig/set-config': 'is-logged-in',
  'homepageconfig/get': 'is-logged-in',
  'product/save': 'is-logged-in',
  'product/get': 'is-logged-in',
  'product/get-by-ids': 'is-logged-in',
  'product/category': 'is-logged-in',
  'product/auto-suggest': 'is-logged-in',
  'product/search': 'is-logged-in',
  'cart/update': 'is-logged-in',
  'cart/state': 'is-logged-in',
  'checkout/init': 'is-logged-in',
  'payment/init': 'is-logged-in',
  'payment/update-status': 'is-logged-in',
  'orders/get': 'is-logged-in',
  'orders/get-received-orders': 'is-super-admin',
  'delivery-route/get': 'is-super-admin',
  'delivery-route/save': 'is-super-admin',
  'customers/get': 'is-super-admin',
  'customers/update-status': 'is-super-admin',
  'drivers/get': 'is-super-admin',
  'drivers/get-all': 'is-super-admin',
  'orders/update-status': true,
  'driver/get-assigned-orders': 'is-driver',
  'shop/add': true,
  'shop/edit': true,
  'shop/update-status': 'is-super-admin',
  'shop/get-all': 'is-super-admin',
  'salesman/get-all': 'is-super-admin',
  'salesman/get-shops': true,
  'location/add': true,
};
