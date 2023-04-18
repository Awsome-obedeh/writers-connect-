const express=require('express')
const router=express.Router();
const passport=require('passport');

// authenticate with google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @call back function

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) =>{
    // Successful authentication, redirect to dasboard
    res.redirect('/dashboard');
  });
    

module.exports=router;