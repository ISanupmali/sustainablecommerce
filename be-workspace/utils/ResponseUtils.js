// Function to format response object
function resultObj(status, msg, data, error) {
  return {
      status: status,
      msg: msg,
      data: data,
      error: error
  }
}

// Exporting functions and objects for external use
module.exports = {
  resultObj
};
