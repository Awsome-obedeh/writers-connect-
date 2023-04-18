require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const ejs=require('ejs');
const morgan=require('morgan')
const expressLayouts=require('express-ejs-layouts');
const routes =require('./routes/index.js');

PORT=process.env.PORT|| 4000;

// connect to mongo db
async  function main(){
   await mongoose.connect(process.env.MONGO_DB_URI);
   console.log('connected to mongo db') 
}
main().catch(err=>console.log(err))
    

// if(process.env.NODE_ENV==='development'){
//     app.use(morgan('dev'))
// }

// template view engine ejs
app.use(expressLayouts);
app.set('view', 'ejs');

// routes
app.use('/',routes);

app.listen(process.env.PORT, console.log(`app running on port  ${PORT}` ))