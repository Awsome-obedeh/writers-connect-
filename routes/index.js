const express=require('express')
const router=express.Router();
const {ensureAuth, ensureGuest, logout,Getdashboard}=require('./../controllers/app.controllers')


// hompage
router.get('/', (req,res)=>{
    res.render('login');
})

// dashboard
router.get('/dashboard',ensureAuth,Getdashboard);

// logout route
router.get('/logout',logout)

module.exports=router;