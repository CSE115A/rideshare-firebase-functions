/* eslint-disable prefer-promise-reject-errors */
const { getPredictions } = require("../../../autocomplete/middleware/google");
const { functions } = require("../../constants");
const axios = require("axios");
jest.mock("axios");

describe("getPredictions Google API Testing Suite", () => {
  beforeEach(() => jest.resetAllMocks());
  describe("when an error happens on google's end", () => {
    it("returns a 500 error", async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject({ data: { error_message: "Internal Server Error" } }),
      );
      return expect(
        getPredictions({ functions, input: "101" }),
      ).rejects.toThrow("Google Error: Internal Server Error");
    });
  });
  describe("when given a valid input", () => {
    it("returns a resolved promise with correct data", async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.resolve({ data: { predictions: [{ lat: 12, lng: -12 }] } }),
      );

      const response = await getPredictions({ functions, input: "1600" });
      expect(response.message).toStrictEqual([{ lat: 12, lng: -12 }]);
      expect(response.status).toEqual(200);
    });
  });
});
