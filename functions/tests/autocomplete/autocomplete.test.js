const { autocomplete } = require("../../autocomplete/autocomplete");
const { response } = require("../constants");
const { getPredictions } = require("../../autocomplete/middleware/google");
const { authenticateToken } = require("../../middleware/middleware");
jest.mock("../../autocomplete/middleware/google");
jest.mock("../../middleware/middleware");

describe("autocomplete Testing Suite", () => {
  beforeEach(() => {
    response.status().send({ undefined });
    jest.resetAllMocks();
  });

  describe("when sending preflight request", () => {
    it("returns 200 with empty body", async () => {
      const res = await autocomplete({ method: "OPTIONS" }, response);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("when correct params and authentication are present", () => {
    it("returns 200 with body", async () => {
      const request = {
        query: { input: "101" },
        header: { authentication: "token" },
      };
      authenticateToken.mockImplementationOnce(() => {
        return { isAuthError: false };
      });
      getPredictions.mockImplementationOnce(() =>
        Promise.resolve({ status: 200, message: [{ lat: 123, lng: 123 }] }),
      );
      const res = await autocomplete(request, response);
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).toBeFalsy();
      expect(res.body.status).toEqual(200);
      expect(res.body.message).toStrictEqual([{ lat: 123, lng: 123 }]);
    });
  });

  describe("when unexpected error happens on google's end", () => {
    it("returns 500 error", async () => {
      const request = {
        query: { input: "101" },
        header: { authentication: "token" },
      };
      authenticateToken.mockImplementationOnce(() => {
        return { isAuthError: false };
      });
      getPredictions.mockImplementationOnce(() =>
        Promise.reject(new Error("Internal Server Error")),
      );
      const res = await autocomplete(request, response);
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toEqual(500);
      expect(res.body.message).toBe("Internal Server Error");
    });
  });
  describe("when request is not authenticated", () => {
    const request = {
      query: { input: "101" },
      headers: { authentication: "wrongKey" },
    };
    it("returns a 401 error", async () => {
      authenticateToken.mockImplementationOnce(() => {
        return {
          isAuthError: true,
          authStatusCode: 401,
          authMessage: "Unset Env Var",
        };
      });
      const res = await autocomplete(request, response);
      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toEqual(401);
      expect(res.body.message).toBe("Unset Env Var");
    });
  });
  describe("when sending incorrect params", () => {
    const request = { query: { input: "" }, headers: {} };
    it("returns a 400 response", async () => {
      authenticateToken.mockImplementationOnce(() => {
        return {
          isAuthError: false,
        };
      });
      const res = await autocomplete(request, response);
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toEqual(400);
      expect(res.body.message).toBe("Missing or Incorrect Params");
    });
  });
});
