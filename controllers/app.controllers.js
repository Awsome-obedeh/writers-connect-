// const express=require('express')
const Story=require('./../models/story.model');



// check if user is logged in 
const ensureAuth=function (req,res, next){
    if(req.isAuthenticated()){
        return next();
    }

    else{
        res.redirect('/');
    }
}

// if user is logged in kepp user in dashboard
const ensureGuest=function(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    }

    else{
        next()
    }
}

// @ Get logout
const logout=(req,res)=>{ 

    // req.session.destroy;
    // // req.logout();
    //  res.redirect('/');
    // req.session.destroy(function(){
    //     res.redirect('/');
    //   });
   
    req.session.destroy(function() {
        res.clearCookie('connect.sid', { path: '/' });
        res.redirect('/');
    });
      
    // req.session.destroy(function() {
    //   res.clearCookie('connect.sid', { path: '/' });
    //   res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
    //   res.setHeader('pragma', 'no-cache');
    //   res.setHeader('expires', '0');
    //   res.redirect('/');
    // });
        
}

// @ Get dashboard
const Getdashboard=async(req,res)=>{
    try{
        const stories=await Story.find({user:req.user.id})
        .sort({createdAt:'desc'});
  
        res.render('dashboard',{name:req.user.firstName, stories:stories
           
        });
    }

    catch(err){
        console.log(err)
        res.render('errors/505');
    }
}

// @ Get story
const Getstory=(req,res)=>{
    res.render('add');
}

// @ Get all stories
const GetStories=async (req,res)=>{
    try{

        const stories=await Story.find({staus:'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        console.log(stories)
        res.render('public_stories', 
        {stories,truncate,replaceHtml,editIcon} )
    }
    catch(err){
        console.log(err);
        res.render('errors/505')
    }

}



const GetEdit=async(req,res)=>{
    try{

 
        id=req.params.id
        const story=await Story.findOne({_id:id});
        console.log(story)
        //  if story no found
        if(!story){
            res.render('errors/404');
        }
        // console.log('my storyid'+ story._id)
        // console.log(req.user._id)

        // if looged in user is not writer of story
        if(story.user != req.user.id){
            res.redirect('/stories');
        }
        else{
            res.render('edit_story',{story});
        }
    }
    catch(err){
        console.log(err)
        res.render('errors/505')
    }
}


// @ Post story
const PostStory=async (req,res)=>{ 
    
    try{
        req.body.user=req.user.id;
        console.log(req.body.user);
        await Story.create(req.body);
        req.flash('success_msg', 'Your story is created successufully');
        res.redirect('/dashboard');
    }

    catch(err){
        console.log(err);
        res.render('erros/505');
    }

}

// @ PUT story(update story)
const UpdateStory=async(req,res)=>{
    try{

  
        let story=await Story.findById(req.params.id);

        // if no story
        if(!story){
            res.render('errors/404');

        }
    
        if(story.user!=req.user.id){
            
        
            res.redirect('/stories');

        }
        else{ 
            console.log("my story user " + story.user)
            story=await Story.findByIdAndUpdate({_id:req.params.id}, req.body ,{
                new:true,
                runValidators:true}
        )} 
        req.flash('success_msg', "Updated Successfully");
        res.redirect('/dashboard');
    
    }
    catch(err){
        res.render('errors/505');
    }
}

// @DELETE story
const DeleteStory=async(req,res)=>{
    try{
       let story=await Story.findByIdAndDelete({_id:req.params.id});
        if(!story){
            res.render('erros/404');
        }
        if(story.user!=req.user.id){
            res.redirect('/stories');
        }
        else{
            req.flash('success_msg',"Story Deleted successfully");
            res.redirect('/dashboard')
        }

    }

    catch(err){
        console.log(err)
    res.render('errors/505')
    }
}



// truncate function

const truncate=function(str,len){
    if(str.length>len && str.length>0){
        let new_str=str + ' '
        new_str=str.substr(0,len)
        new_str=str.substr(0, new_str.lastIndexOf(' '))
        new_str=new_str.length>0?new_str:str.substr(0,len)
        return new_str + '.... '
    }
    return str
}

const replaceHtml=function(input){
  const remove= input.replace(/<\/?p>|&nbsp;/gi, ''); 
//   let remove=input.replace(/<(?:.|\n)*?>/gm, ''); 
  return remove

    
    
    
}

// update post if user is logged in
const editIcon=function(storyCreator,loggedUser,storyId,floating=true){
    if(storyCreator._id.toString()==loggedUser._id.toString()){
       
         if(floating){
              return `<a href="/stories/edit${storyId}" class="btn-floating halfway-fab blue lighten-3"><i class="fas fa-edit fa-small"></i></a>`
        
         }
        
        else{
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i/></a>`
        }  
    }
    else{
        return ''
    }
}

// select options public orr private
// const select = function(selected,options){
//     return options
//     .fn(this)
//     .replace(
//         new RegExp(' value="' +selected + '"'),
//         '$& selected="selected"'
//     )
//     .replace(
//         new RegExp('>' +selected +'</optiion>'),
//         'selected="selected:$&'
//     )
// }

module.exports={
    ensureGuest,
    ensureAuth,
    logout,
    Getdashboard,
    Getstory,
    GetStories,
    GetEdit,
    PostStory,
    UpdateStory,
    DeleteStory,
    truncate,
    replaceHtml,
    editIcon,
   

};