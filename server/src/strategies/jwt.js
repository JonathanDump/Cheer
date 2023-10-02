const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter("token"),
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log("jwt_payload", jwt_payload.user);
      const user = await User.findById(jwt_payload.user._id);

      if (user) {
        return done(null, jwt_payload.user);
      }
      console.log("jwt no user");
      return done(null, false);
    } catch (err) {
      console.log(err);
      return done(err, false);
    }
  })
);

module.exports = passport;
