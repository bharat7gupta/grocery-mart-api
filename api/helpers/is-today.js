module.exports = {
  friendlyName: `isToday`,

  description: `check if given date is today's date`,

  inputs: {
    timestamp: {
      type: 'number'
    }
  },

  fn: function isToday(inputs) {
    if (inputs.timestamp) {
      const dateToCheck = new Date(inputs.timestamp);
      const today = new Date();

      return dateToCheck.getDate() == today.getDate() &&
        dateToCheck.getMonth() == today.getMonth() &&
        dateToCheck.getFullYear() == today.getFullYear();
    }

    return false;
  }
};
