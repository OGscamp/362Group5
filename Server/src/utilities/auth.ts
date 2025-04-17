let passport = require('passport');
import { Strategy as CustomStrategy } from 'passport-custom';
import { MongoConn } from './mongo-connect';

// passport not getting called for atuhentication
passport.use(new CustomStrategy(async (req, done) => {
    const { username, password } = req.body;
  
    try {
      const mongo = MongoConn.getInstance();
      const users = mongo.notAirBnbDB.db('notairbnb').collection('users');
      const user = await users.findOne({ username });
  
      if (!user || user.password !== password) {
        return done(null, false);
      }
  
      done(null, { username: user.username, action: 'createCookie' });
    } catch (err) {
      console.error('Auth error:', err);
      done(err);
    }
  }));

passport.protected = (req, res, next) => {
    //if (req.isAuthenticated()){
    if (req.cookies && req.cookies.path_authorized){
        return next();
    } else {
		// this aussumes that the user does not have the right cookies so they go to login page
        res.status(401).json({ error: 'Unauthorized' });
        //res.redirect('/login');
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