import passport from "passport";
import passportJWT from "passport-jwt";
import User from "../models/User.js";

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

export default function () {
    const strategy = new Strategy(params, (payload, done) => {
        User.findById(payload.id)
            .then(user => {
                if (payload.expire <= Date.now()) {
                    return done(new Error("TokenExpired"), null);
                }
                return done(null, user);
            })
            .catch(err => done(err, null));
    });

    passport.use(strategy);

    return {initialize: () => passport.initialize()};
};