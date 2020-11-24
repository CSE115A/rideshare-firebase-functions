const { getGeo } = require("../../geocode/geocode");
const { getGoogleCodes } = require("../../geocode/middleware/google");
const { response, request } = require("../constants");
jest.mock("../../geocode/middleware/google");
const mockConfig = require("firebase-functions-test")();

describe("getGeo Testing Suite", () => {
  beforeEach(() => {
    response.status().send({ undefined });
    jest.resetAllMocks();
  });
  describe("when given proper params", () => {
    it("returns 200 OK with proper body", async () => {
      getGoogleCodes.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          message: { geo: { lat: 37.6430412, lng: -95.4604032 }, id: "1234" },
        }),
      );
      request.query = {
        address: "1600 Amphitheatre Parkway, Mountain View, CA",
      };
      await getGeo(request, response);
      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.status).toEqual(200);
      expect(response.body.message).toEqual({
        geo: { lat: 37.6430412, lng: -95.4604032 },
        id: "1234",
      });
    });
  });

  describe("when query is undefined", () => {
    it("returns 400 BAD REQUEST error with correct fields", async () => {
      request.query = { undefined };
      getGoogleCodes.mockImplementationOnce(() =>
        Promise.resolve({ status: 400, message: "Improper Params" }),
      );
      await getGeo(request, response);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toBe("Improper Params");
    });
  });

  describe("when API key is unset", () => {
    it("returns 500 Internal Server Error", async () => {
      mockConfig.mockConfig({
        location: {},
      });
      request.query = {
        address: "1600 Amphitheatre Parkway, Mountain View, CA",
      };
      getGoogleCodes.mockImplementationOnce(() =>
        Promise.reject(new Error("Internal Server Error")),
      );
      await getGeo(request, response);
      expect(response.statusCode).toEqual(500);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(500);
      expect(response.body.message).toBe("Internal Server Error");
    });
  });

  describe("when query is missing", () => {
    it("returns 400 BAD REQUEST with appropriate body", async () => {
      request.query = {};
      await getGeo(request, response);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toBe(
        "Params Error: missing or incorrect address format",
      );
    });
  });
});
