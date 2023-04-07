const jwt = require("jsonwebtoken");
const secretKey =
  "107AA8D2C9EEEF5F86CAFCA64846073338891841304E6704631E8E186A71B363";

module.exports = {
  checkAuthorization: function (req, res, next) {
    const header = req.headers.authorization;
    res.locals.authed = false;
    res.locals.unauthorizedToken = false;

    if (header) {
      if (header.split(" ").length !== 2) {
        res.status(401).json({
          error: true,
          message: "Authorization header is malformed",
        });
        return;
      }
      const token = header.split(" ")[1];
      try {
        const decode = jwt.verify(token, secretKey);

        if (decode.exp < Date.now()) {
          res.status(401).json({
            error: true,
            message: "JWT token has expired",
          });
          return;
        }

        if (req.params.email != undefined) {
          if (req.params.email != decode.email) {
            res.locals.unauthorizedToken = true;
          }
        }

        res.locals.authed = true;
      } catch (e) {
        res.status(401).json({
          error: true,
          message: "Invalid JWT token",
        });
        return;
      }
    }

    next();
  },
  sign: function (email, expires_in) {
    const exp = Date.now() + expires_in * 1000;
    return jwt.sign({ email, exp }, secretKey);
  },
};
