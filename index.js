const express = require('express');
const connectDB = require('./db/mongodb-connection')
const User = require('./models/user');
const { Schema } = require('mongoose');
const app = express();
const PORT = 4000;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
connectDB()

app.get('/',(req,res) => {
    res.send('Hello Vidhi!How are you ?')
})

app.post('/login',(req,res)=>{

    res.send('Now lets initialise login page')
})

app.get('/get-all-user',(req,res)=>{

    res.send(userData)
})


app.post('/sign-up',(req,res)=>{
    if(req.body?.FirstName.length < 1) {
        console.log('Please enter first name');
        return;
    }
    if(req.body?.LastName.length < 1) {
        console.log('Please enter last name');
        return;
    }
    if(req.body?.EmailId.length < 1) {
        console.log('Please enter email id');
        return;
    }
    if(req.body?.Password.length < 1) {
        console.log('Please enter password');
        return;
    }

    const userData = new User({
        firstName:req.body?.FirstName,
        lastName:req.body?.LastName,
        email:req.body?.EmailId,
        password:req.body?.Password
    })
    userData.save().then(()=> {
        console.log('Data saved')
    }).catch(()=>{
        console.log('Error while saving data')
    })
    res.send('Now lets initialise sign up page')
})


app.listen(PORT,() => {
    console.log('Hi buudy ! Are you listening ?')
})

