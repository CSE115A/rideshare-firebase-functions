const { functions } = require("./constants");
const { authenticateToken } = require("../middleware/middleware");

describe("authenticateToken Tests", () => {
  describe("when auth key is the correct one", () => {
    it("returns no errors", () => {
      const headers = { authentication: "token" };
      const { isAuthError, authStatusCode, authMessage } = authenticateToken({
        functions,
        headers,
      });
      expect(isAuthError).toBeFalsy();
      expect(authStatusCode).toBeNull();
      expect(authMessage).toBeNull();
    });
  });
  describe("when auth key is not set", () => {
    it("returns 500 error", () => {
      const wrongFunction = {
        config: () => {
          wrongFunction.getprices = { auth_token: undefined };
          return wrongFunction;
        },
      };
      const headers = {};
      const { isAuthError, authStatusCode, authMessage } = authenticateToken({
        functions: wrongFunction,
        headers,
      });
      expect(isAuthError).toBeTruthy();
      expect(authStatusCode).toEqual(500);
      expect(authMessage).toBe("ERROR: UNSET API KEY ENV VAR");
    });
  });
  describe("when given incorrect auth token", () => {
    it("returns 401 error", () => {
      const headers = { authentication: "wrongToken" };
      const { isAuthError, authStatusCode, authMessage } = authenticateToken({
        functions,
        headers,
      });
      expect(isAuthError).toBeTruthy();
      expect(authStatusCode).toEqual(401);
      expect(authMessage).toBe("Invalid Authorization Token");
    });
  });
});
