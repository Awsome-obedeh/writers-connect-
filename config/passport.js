const GoogleStrategy=require('passport-google-oauth20').Strategy;
const mongoose=require('mongoose');
const User=require('./../models/user.models.js');

module.exports=function (passport){
   passport.use (new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'/auth/google/callback'
   },
   async(accessToken, refreshToken, profile,done)=>{
    const newUser=({
        googleId:profile.id,
        displayName:profile.displayName,
        firstName:profile.name.givenName,
        lastName:profile.name.familyName,
        image:profile.photos[0].value
    });

// check if user is already registered in the database
    try{
        let user=await User.findOne({googleId:profile.id});
        if(user){
            return done(null,user)
        }
        else{
            user= await User.create(newUser);
        }


    }
    catch (err){
        console.log(err);
    }

    console.log(profile);
    
   }))


   // serialize the user object
    passport.serializeUser((user, done)=> {

    done(null, user.id);
  
    });

   
// passport.deserializeUser(function(id, done) {
//     User.findById(id).exec(function(err, user) {
//       done(err, user);
//     });
//   });
      

  passport.deserializeUser(function(id, done) {
    User.findById(id).exec().then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });
// deserilize user

  
//       passport.deserializeUser(async (id, done) => {
       
//         try{ 
         
//           const user= await User.findById(id) 
//             // if (err) return done(err);
//             // if (!user) return done(null, false);
//              done(err, user) 
         
//         }  
        
//         catch(err){
//             console.log(err,user);
//         }
//   });
    

    // passport.deserializeUser(async(id,done)=>{
    //   const user = await  User.findById(id,
        
    //         (err,user)=>{
    //         done(err,user)}
    // )
        
        
    // })
    }