const axios = require("axios");

exports.getPredictions = async ({ functions, input }) => {
  const apiKey = functions.config().autocomplete.apikey;
  const endpoint = functions.config().autocomplete.endpoint;

  return await axios
    .get(endpoint, {
      params: { input: input, key: apiKey },
    })
    .then((res) => {
      return Promise.resolve({
        status: 200,
        message: res.data.predictions,
      });
    })
    .catch((err) => {
      return Promise.reject(
        new Error(`Google Error: ${err.data.error_message}`),
      );
    });
};
