const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose')
// Create a new express application named 'app'
const app = express();
const session = require('express-session')
const passport = require('passport')
const discordStrategy = require('./strategies/discordstrategy')
const db = require("./database/database")

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

// Database connection !
mongoose.connect(db, connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })



// Set our backend port to be either an environment variable or port 5000
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const dashboardRoutes = require("./routes/dashboard")

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// This application level middleware prints incoming requests to the servers console, useful to see incoming requests
app.use((req, res, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: [ 'http://localhost:3000' ],
    credentials: true
}))

// Configure the bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(session({
    secret:"Some Secret",
    cookie: {
        "maxAge":60000 * 60 * 24
    },
    saveUninitialized:false,
    name:"discord.oauth"
}))

// passport 

app.use(passport.initialize());
app.use(passport.session())


app.use(express.static(path.join(__dirname, 'public')));

// Configure app to use route
app.use('/api/v1/', authRoutes);
// Configure the CORs middleware
app.use("/dashboard", dashboardRoutes)


// This middleware informs the express application to serve our compiled React files
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, './dist')));

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, './dist/', 'index.html'));
    });
};


// Configure our server to listen on the port defiend by our port variable
app.listen(port, () => console.log(`BACK_END_SERVICE_PORT: ${port}`));