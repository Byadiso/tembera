import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
import session from 'express-session';
require('dotenv').config(); 
import path from 'path';
import middleware from './middleware';


// // middleware
// app.get("/", middleware.requireLogin, (req,res)=>{
//     var payload = {
//         pageTitle:"Home",
//         userLoggedIn: req.session.user,
//         userLoggedInJs: JSON.stringify(req.session.user)
//     }
//     res.status(200).json({
//         payload: payload
//     })
// });


//import routes 

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import categoryRoutes from './routes/category';
import moneyRoutes from './routes/money';



//app 
const app = express();

//for cross origin 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  // session

  app.use(session({
    secret: "yes-yeso",
    resave: true,
    saveUninitialized: false
}));


//db
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://byadiso:Uwineza3010@cluster0.kbaby.mongodb.net/kodesha?retryWrites=true&w=majority' ,  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>console.log('DB Connected')).catch((err)=>{
    console.error(`Error connecting to  the database . \n${err}`);
});

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", moneyRoutes);


// set header

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


// set static pages

app.use(express.static(__dirname));
app.use(express.static('public'));

// set up route

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
        res.status(200)
        .json({
            status: 200,
            message: 'Welcome to PropertyPro-Lite you can sale or rent your needs!',
        })
})

app.use('*', (req, res) => {
    res.status(400).json({
        status: 400,
        message: "Sorry this router doesn't exist !",
    })
})



//-----------------For Front-End---------------------//

//for render index

app.get('/', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('/index.html');
})

// for render sign-up



// for render login
  app.get('/login', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('/login.html');
})
//for index page
app.get('/index', (_req, res) => {
    res.sendFile(__dirname + '/public/index.html')
        .status(200)
        .json({
            status: 200,
            message: 'Welcome to PropertyPro-Lite you can sale or rent your needs!',
        })
})


const port = process.env.PORT || 3000 ;

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'))
    });
} else {
    app.get("/",(req,res)=>{
        res.send("Api running");
    });
}

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})