exports.authenticateToken = ({ functions, headers }) => {
  const { authentication } = headers;
  const correctKey = functions.config().getprices.auth_token;
  if (correctKey === undefined) {
    return {
      isAuthError: true,
      authStatusCode: 500,
      authMessage: "ERROR: UNSET API KEY ENV VAR",
    };
  }

  return {
    isAuthError: authentication !== correctKey,
    authStatusCode: authentication === correctKey ? null : 401,
    authMessage:
      authentication !== correctKey ? "Invalid Authorization Token" : null,
  };
};
