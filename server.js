const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
  });

//below are just middleware - everything comes through the server will be processed by them first
//first one is to transform everything we received into JSON
//second is Cross-Origin Resource Sharing,  
app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send(`it is working, isn't it?`);
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req,res) => { image.handleImage(req, res, db)} )
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000,() => {
  console.log(`app is running on port ${process.env.PORT}`)
})