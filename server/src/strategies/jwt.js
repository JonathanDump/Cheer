const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter("token"),
  ]),
  secretOrKey: process.env.JWT_SECRET_KEY,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(opts, async (req, jwt_payload, done) => {
    console.log("jwt_payload", jwt_payload);
    const user = await User.findById(jwt_payload.user._id);

    if (user) {
      console.log("user", user);
      return done(null, user);
    }
    console.log("jwt no user");
    return done(null, false);
  })
);

module.exports = passport;
