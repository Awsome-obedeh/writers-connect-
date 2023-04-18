const express=require('express')
const { ObjectId } = require('mongodb');
const router=express.Router();
const {ensureAuth, ensureGuest, logout,Getstory,PostStory,truncate,replaceHtml,editIcon,GetStories,GetEdit,UpdateStory,DeleteStory}=require('./../controllers/app.controllers')
const Story=require('./../models/story.model');

// show add stories page
// @route GET stories/add
router.get('/add', ensureAuth, Getstory)

// Post user story to database
// @route POST /stories
router.post('/', PostStory)


// show stories by user
// @ route GET /stories
router.get('/', ensureAuth, GetStories)

// showt edit page
// @ route GET edit stories/edit:id  
router.get('/edit:id',ensureAuth,GetEdit)


// update user story
// @ router put /stories:id
router.put('/:id', ensureAuth, UpdateStory)


// delete  user story
// @ router delete /stories:id

router.delete('/:id',ensureAuth,DeleteStory)


// show single story
// @ router GET /stories:id

router.get('/:id',ensureAuth,async(req,res)=>{
    try{
        const { ObjectId } = require('mongodb');
        let id=new ObjectId(req.params.id);
        let story=await Story.findById(req.params.id)
        .populate('user');
        let User=req.user

        if(!story){
            res.render('errors/404');
        
        }
        res.render('show_stories',{
            story,editIcon})
        console.log(story)
        console.log(req.user)
    }

    catch(err){
        console.log(err);
        res.render('errors/404')

    }

    
})

// more stories from user
    // @ GET stories/user/:userId
    router.get('/user/:userid',ensureAuth,async(req,res)=>{
        try{
        
        //     let user=new ObjectId(req.params.id);
        //    let user=req.params.id
            const stories=await Story.find({
                user:req.params.userid,
                staus:'public'
            })
            .populate('user')
            res.render('public_stories',{stories,editIcon,replaceHtml,truncate});
        

        }
     catch(err){
            console.log(err)
            res.render('errors/505');
        }
    })
module.exports=router;