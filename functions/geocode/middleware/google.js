const axios = require("axios");

exports.getGoogleCodes = async ({ functions, address }) => {
  const locationEndpoint = functions.config().location.endpoint;
  const apiKey = functions.config().location.key;

  return await axios
    .get(locationEndpoint, {
      params: {
        address,
        key: apiKey,
      },
    })
    .then((resp) => {
      if (resp.data.status === "REQUEST_DENIED") {
        return Promise.resolve({
          status: 500,
          message: "Invalid API Key!",
        });
      }

      return Promise.resolve({
        status: 200,
        message: {
          geo: resp.data.results[0].geometry.location,
          id: resp.data.results[0].place_id,
        },
      });
    })
    .catch((err) => {
      return Promise.reject(
        new Error(`Google Error: ${err.response.data.error_message}`),
      );
    });
};
