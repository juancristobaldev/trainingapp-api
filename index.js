//packages


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
    res.send('Api funcionando')
})

app.get('/cookie' ,(req,res) => {
    res.send('done')
})


app.listen(port,() => {
    console.log('Corriendo puerto en puerto ' + port)
})

