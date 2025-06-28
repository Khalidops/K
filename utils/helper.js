const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const formatDate = (date) => {
  return date.toISOString().replace('T', ' ').split('.')[0];
};

module.exports = {
  delay,
  formatDate,
};
