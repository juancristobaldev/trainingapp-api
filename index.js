//packages

require('dotenv').config({path:'./.env'})


const mysql = require('mysql');
const { JSON } = require('mysql/lib/protocol/constants/types');

const dbUrl = process.env.DATABASE_URL;
let connection

const connectDB = async () => {
    if( connection ) return connection
    try {
        connection = await mysql.createConnection(dbUrl)
        connection.connect( err => {
            if(err) throw err
            else console.log('Connect to DB succesful')
        })
    }catch (err) {
        console.log('Cant connect to db', process.env.DATABASE_URL, err)
        process.exit(1)
    }
 
    return connection
}


const {buildSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql')

const {readFileSync} = require('fs')
const {join} = require('path')

const express = require('express'),
app = express()

const cors = require('cors'),
bodyparser = require('body-parser'),
session = require('express-session'),
cookieParser = require('cookie-parser')

//env

require('dotenv').config({path:'./.env'})

//middlewares
app.use(cookieParser())

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(cors());

app.use(session({
    secret: 'mysecretkey',
    resave:true,
    saveUninitialized:true,
    cookie: 
    { 
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 7200000,
    }
}));

const resolvers = require('./lib/resolvers')

const schema = buildSchema(
    readFileSync(
        join(__dirname, 'lib', 'schema.graphql'),
        'utf-8'
    )
)


app.use('/graphql', graphqlHTTP({
    schema,
    rootValue:resolvers,
    graphiql:true,

}))

// port

const port = process.env.PORT;

// routes

app.get( '/', (req,res) => {
    const connection = connectDB()
    if(connection){
        res.send('Api on Vercel and Mysql')
    }else     res.send('Api on Vercel')
})

app.get('/cookie' ,(req,res) => {
    res.send('done')
})


app.listen(port,() => {
    console.log('Corriendo puerto en puerto ' + port)
})

