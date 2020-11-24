const functions = require("firebase-functions");
const { getGoogleCodes } = require("./middleware/google");

exports.getGeo = functions.https.onRequest(async (request, response) => {
  const address = request.query.address;

  if (Object.keys(request.query).length === 0 || address === "") {
    return response.status(400).send({
      error: true,
      status: 400,
      message: "Params Error: missing or incorrect address format",
    });
  }

  return await getGoogleCodes({ functions, address })
    .then((res) => {
      return response.status(res.status).send({
        error: res.status > 200,
        status: res.status,
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
});