const express = require("express");
const mongoose = require("mongoose");
const session = require ("express-session");
const compagnyRouter= require('./Routes/compagnyRouter');
const workerRouter= require('./Routes/workerRouter');
require ('dotenv').config(); //ATTENTION à mettre soit en haut de la page soitau dessus de const db


const db = process.env.BDD_URL;
const app = express();




app.use(session({secret: process.env.SESSION_PWD,saveUninitialized: true, resave: true}));
app.use(express.static("./assets"))//PERMETS A APP (A EXPRESS) D'UTILISER LES DOSSIERS STATICS DS ASSETS
app.use(express.urlencoded({extended: true}));
app.use (express.json());// pour que express utilise le json 
app.use (compagnyRouter);
app.use (workerRouter);


//app écoute sur le port 3000
app.listen(3000, (err) => {
    if (err){
        console.log(err);
    }else{
        console.log("connecté");
    }
})

//méthode pr demander à mongoose de se connecter à la bdd (mongodb)
mongoose.set('strictQuery', true)
mongoose.connect(db, (err)=>{
    if (err) {
        console.log(err);   
    }else{
        console.log("connecté à la bdd");
    }
})
