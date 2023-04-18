const mongoose=require('mongoose');
const StorySchema=new mongoose.Schema({
    title:{
        type:String,
        require:true,
        trim:true
    },

   body:{
        type:String,
        required:true
    },

   staus:{
        type:String,
        default:'public',
        enum:['public','private']
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'person'
    },

    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const storymodel= mongoose.model('story',StorySchema);
module.exports=storymodel;