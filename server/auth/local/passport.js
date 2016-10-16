import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

function localAuthenticate(User, email, password, done) {
  User.findOne({
    email: email.toLowerCase(),
  }).exec()
    .then(user => {
      if(!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      } else {
        const st = user.status;
        if(st !== 'active') {
          if(st === 'inactive') {
            return done(null, false, { message: 'This user is not actived' });
          } else if(st === 'deactive') {
            return done(null, false, { message: 'This user has been blocked' });
          } else {
            return done(null, false, { message: 'This user was deleted' });
          }
        }
        user.authenticate(password, function(authError, authenticated) {
          if(authError) {
            return done(authError);
          }
          if(!authenticated) {
            return done(null, false, { message: 'This password is not correct.' });
          } else {
            return done(null, user);
          }
        });
      }
    })
    .catch(err => done(err));
}

export function setup(User/*, config*/) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function(email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
}
