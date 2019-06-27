const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user')

//starting app and mongoDb local storage server
const app = express();
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/shoppingMongoose',
  collection: 'sessions'
});
const csrfProtection = new csrf();
const fileStorage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null, 'images')
  },
  filename: (req,file,cb)=>{
    cb(null,new Date().toISOString() + '-' + file.originalname);
  }
})
const fileFilterF = (req,file,cb)=>{
  if((file.mimetype=='image/png')||(file.mimetype=='image/jpg')||(file.mimetype=='image/jpeg')){
    // console.log('approved format');
    cb(null,true);
  }
  else{
    cb(null,false);
  }
}

//setting up dynamic rendering engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//setting up routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//middlewares to be used by every incoming request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilterF}).single('imageUrl')) //configuring file storage options
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
  secret: 'nightwayne', 
  resave: false, 
  saveUninitialized: false,
  store: store
}))

//csrfProtection & flash messages which get destroyed when request served(through response-send/redirect)
app.use(csrfProtection);
app.use(flash());

//session setting up & adding fields to request body
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//routing requests & error handling middleware
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get500)
app.use(errorController.get404);

app.use(function(err,req,res,next){
  res.redirect('/500');
});

//connecting with db-local and setting up server
mongoose.connect('mongodb://localhost:27017/shoppingMongoose', {useNewUrlParser: true})
.then(result => {
  console.log('Connected to local server!');
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});