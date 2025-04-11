let passport = require('passport');
import { Strategy as CustomStrategy } from 'passport-custom';

passport.use(new CustomStrategy(
    function(req, done) {
        if(req.cookies && req.cookies.path_authorized){
            done(null, {"action":"carryOn"});
        } else if (req.body.password && req.body.password == 'lemon'){
            console.log("HERE");
            done(null, {"action":"createCookie"});
        } else {
            console.log(req.body);
            done(null, false);
        }
    }
));

passport.protected = (req, res, next) => {
    //if (req.isAuthenticated()){
    if (req.cookies && req.cookies.path_authorized){
        return next();
    } else {
		// this aussumes that the user does not have the right cookies so they go to login page
        res.redirect('/login')
        //return next();
    }
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


export let Auth = passport;
export default passport;