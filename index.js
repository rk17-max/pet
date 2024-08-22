const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/Listing');
const bodyParser = require('body-parser'); 

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
async function main() {
    await mongoose.connect('mongodb://localhost:27017/petsworld');
    console.log('Connected successfully');
  }
  
  main().catch(err => console.log('Error connecting to database', err));

app.get('/listings',(req,res)=>{
    res.render("web.ejs");
})

app.get('/listings/new',(req,res)=>{
    res.render("new.ejs");
})

app.post('/listings/new',(req,res)=>{
    console.log(req.body);
})



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})