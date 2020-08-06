module.exports = {

  friendlyName: 'Get otp code',

  description: 'Get otp code based on otpNumDigits custom config',

  sync: true,

  fn: function () {
    const otpNumDigits = sails.config.custom.otpNumDigits;
    let otpCode = '';

    for (let i=0; i< otpNumDigits; i++) {
      // random number between 0 to 9
      const randomNumber = (Math.random() * 9);

      otpCode += Math.floor(randomNumber)
    }

    return otpCode;
  }
};
