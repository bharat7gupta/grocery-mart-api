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
  'otp/*': true,
  'view-homepage-or-redirect': true,
  'view-faq': true,
  'view-contact': true,
  'legal/view-terms': true,
  'legal/view-privacy': true,
  'deliver-contact-form-message': true,
  'home-page-config/set-config': true,
  'home-page-config/get-all': true,
  'product/save': true,
  'product/get': true,
  'product/get-by-ids': true
};
