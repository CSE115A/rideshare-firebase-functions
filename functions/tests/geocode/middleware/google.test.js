/* eslint-disable prefer-promise-reject-errors */
const axios = require("axios");
const { getGoogleCodes } = require("../../../geocode/middleware/google");
const { functions } = require("../../constants");
jest.mock("axios");

describe("Middleware Testing Suite", () => {
  const address = "1600 Amphitheatre Parkway, Mountain View, CA";
  describe("when invalid API key is set", () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { status: "REQUEST_DENIED" },
      }),
    );
    it("resolves the promise with a 500 error", async () => {
      const promiseResponse = await getGoogleCodes({ functions, address });
      expect(promiseResponse.status).toEqual(500);
      expect(promiseResponse.message).toBe("Invalid API Key!");
    });
  });

  describe("when unknown Google Error exists", () => {
    axios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: { data: { error_message: "Internal Server Error" } },
      }),
    );
    it("rejects the promise with another 500 error", async () => {
      return expect(getGoogleCodes({ functions, address })).rejects.toThrow(
        "Internal Server Error",
      );
    });
  });

  describe("when given correct params", () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          results: [
            {
              geometry: { location: { lat: 37.6430412, lng: -95.4604032 } },
              place_id: "1234",
            },
          ],
        },
      }),
    );
    it("returns a successful resolved promise", async () => {
      const promiseResponse = await getGoogleCodes({ functions, address });
      expect(promiseResponse.status).toEqual(200);
      expect(promiseResponse.message).toStrictEqual({
        geo: { lat: 37.6430412, lng: -95.4604032 },
        id: "1234",
      });
    });
  });
});
