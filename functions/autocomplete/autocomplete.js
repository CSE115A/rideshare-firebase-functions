const functions = require("firebase-functions");
const { getPredictions } = require("./middleware/google");
const { authenticateToken } = require("../middleware/middleware");

exports.autocomplete = functions.https.onRequest(async (request, response) => {
  response.set({ "Access-Control-Allow-Origin": "*" });
  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Headers", "authentication");
    return response.status(200).send("");
  } else {
    const { query, headers } = request;
    const { isAuthError, authStatusCode, authMessage } = authenticateToken({
      functions,
      headers,
    });

    if (isAuthError) {
      return response.status(401).send({
        error: isAuthError,
        status: authStatusCode,
        message: authMessage,
      });
    }

    if (Object.keys(query).length === 0 || query.input === "") {
      return response.status(400).send({
        error: true,
        status: 400,
        message: "Missing or Incorrect Params",
      });
    }

    return await getPredictions({
      input: query.input,
      functions,
    })
      .then((res) => {
        return response.status(200).send({
          error: false,
          status: 200,
          message: res.message,
        });
      })
      .catch((err) => {
        return response.status(500).send({
          error: true,
          status: 500,
          message: err.message,
        });
      });
  }
});
