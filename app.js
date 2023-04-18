require('dotenv').config();
const path= require('path');
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejs=require('ejs');
const morgan=require('morgan')
const expressLayouts=require('express-ejs-layouts');
const flash=require('connect-flash');
const passport=require('passport');
require('./config/passport.js')(passport);
const session=require('express-session');
const MongoStore=require('connect-mongodb-session')(session)

// store user sessions in the database
const store=new MongoStore({uri:process.env.MONGO_DB_URI});

// body parser
app.use(express.urlencoded({extended:false}))

// method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))
  
// ROUTES
const routes =require('./routes/index.js');
const AuthRoutes=require('./routes/auth.js');
const stories=require('./routes/stories.js');


PORT=process.env.PORT||1000;

// connect to mongo db
async  function main(){
   await mongoose.connect(process.env.MONGO_DB_URI,
    {useNewUrlParser: true,
    useUnifiedTopology: true});
   console.log('connected to mongo db') 
}
main().catch(err=>console.log(err))
    

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

// static folders
app.use(express.static(path.join(__dirname, 'public')));

// template view engine ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// session
app.use(session({
    secret:'login',
    saveUninitialized: false,
    resave: false,
    store:store
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global variable
app.use(function (req,res,next){
    res.locals.user=req.user || null
    res.locals.success_msg=req.flash('success_msg');

    next()
})

// routes
app.use('/',routes);
app.use('/auth',AuthRoutes);
app.use('/stories',stories)

app.listen(process.env.PORT, console.log(`app running on port  ${PORT}` ))