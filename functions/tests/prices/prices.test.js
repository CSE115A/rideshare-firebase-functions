/* eslint-disable prefer-promise-reject-errors */
const { getPrices } = require("../../prices/prices");
const mockConfig = require("firebase-functions-test")();
const { request, response } = require("../constants");
const { getLyftPrices } = require("../../prices/middleware/lyft");
const { getUberPrices } = require("../../prices/middleware/uber");
const { authenticateToken } = require("../../middleware/middleware");
jest.mock("../../prices/middleware/lyft");
jest.mock("../../prices/middleware/uber");
jest.mock("../../middleware/middleware");

mockConfig.mockConfig({
  getprices: {
    uber_endpoint: "www.test.com",
    lyft_endpoint: "www.test1.com",
  },
});

describe("getPrices Testing Suite", () => {
  beforeEach(() => {
    response.status().send({ undefined });
    jest.resetAllMocks();
  });
  describe("when validating", () => {
    describe("if incorrect token is supplied", () => {
      it("returns 401", async () => {
        authenticateToken.mockImplementationOnce(() => {
          return {
            isAuthError: true,
            authStatusCode: 401,
            authMessage: "Wrong Token",
          };
        });
        await getPrices(request, response);
        expect(response.statusCode).toEqual(401);
        expect(response.body.error).toBeTruthy();
        expect(response.body.status).toEqual(401);
        expect(response.body.message).toBe("Wrong Token");
      });
    });
    describe("if token is unset in environment", () => {
      it("returns 500 error message with correct fields", async () => {
        authenticateToken.mockImplementationOnce(() => {
          return {
            isAuthError: true,
            authStatusCode: 500,
            authMessage: "Unset Env Var",
          };
        });
        await getPrices(request, response);
        expect(response.statusCode).toEqual(500);
        expect(response.body.error).toBeTruthy();
        expect(response.body.status).toEqual(500);
        expect(response.body.message).toBe("Unset Env Var");
      });
    });
  });
  describe("when given incomplete params", () => {
    describe("when lyft's params are invalid", () => {
      it("should return 400 bad request error message", async () => {
        authenticateToken.mockImplementationOnce(() => {
          return { isAuthError: false };
        });
        getLyftPrices.mockImplementationOnce(() =>
          Promise.resolve({
            status: 400,
            message: "Lyft: Incorrect Params",
          }),
        );
        request.query = {
          start_lat: 123,
          start_lng: 123,
        };
        await getPrices(request, response);
        expect(response.body.status).toEqual(400);
        expect(response.body.error).toBeTruthy();
        expect(response.body.message).toBe("Lyft: Incorrect Params");
        expect(response.statusCode).toBe(400);
      });
    });
    describe("when uber's params are invalid", () => {
      it("throws a 400 error bad request", async () => {
        authenticateToken.mockImplementationOnce(() => {
          return { isAuthError: false };
        });
        getLyftPrices.mockImplementationOnce(() => Promise.resolve(true));
        getUberPrices.mockImplementationOnce(() =>
          Promise.resolve({ status: 400, message: "Uber: Missing Params" }),
        );
        request.query = {
          start_lat: 123,
          start_lng: 123,
        };

        request.headers = {
          authentication: "token",
        };

        await getPrices(request, response);
        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toBeTruthy();
        expect(response.body.status).toEqual(400);
        expect(response.body.message).toBe("Uber: Missing Params");
      });
    });
  });
  describe("when given correct params", () => {
    it("returns 200 successful response with appropriate fields", async () => {
      authenticateToken.mockImplementationOnce(() => {
        return { isAuthError: false };
      });
      getLyftPrices.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          message: [{ displayName: "Lyft", price: "$10-12" }],
        }),
      );
      getUberPrices.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          message: [{ displayName: "Uber", price: "$12-14" }],
        }),
      );
      await getPrices(request, response);
      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.status).toEqual(200);
      expect(response.body.message).toStrictEqual({
        lyft: [{ displayName: "Lyft", price: "$10-12" }],
        uber: [{ displayName: "Uber", price: "$12-14" }],
      });
    });
  });
  describe("when server side error happens", () => {
    request.query = {
      start_lat: 123,
      start_lng: 123,
      end_lat: 123,
      end_lng: 123,
    };
    describe("with uber", () => {
      it("throws a 500 error pointing", async () => {
        authenticateToken.mockImplementationOnce(() => {
          return { isAuthError: false };
        });
        getLyftPrices.mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            message: [{ displayName: "Lyft", price: "$10-12" }],
          }),
        );
        getUberPrices.mockImplementationOnce(() =>
          Promise.reject(new Error("Missing Token")),
        );
        await getPrices(request, response);
        expect(response.statusCode).toEqual(500);
        expect(response.body.error).toBeTruthy();
        expect(response.body.status).toEqual(500);
        expect(response.body.message).toBe("Missing Token");
      });
    });
    describe("with Lyft", () => {
      it("throws a 500 error pointing", async () => {
        authenticateToken.mockImplementationOnce(() => {
          return { isAuthError: false };
        });
        getLyftPrices.mockImplementationOnce(() =>
          Promise.reject(new Error("Lyft Error")),
        );
        await getPrices(request, response);
        expect(response.statusCode).toEqual(500);
        expect(response.body.error).toBeTruthy();
        expect(response.body.status).toEqual(500);
        expect(response.body.message).toBe("Lyft Error");
      });
    });
  });
});
