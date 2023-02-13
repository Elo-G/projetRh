const mongoose = require("mongoose");

const compagnySchema = new mongoose.Schema({

  name :{
    type:String,
    required: [true,'nom requis'],
  },

  siretNumber:{
    type: String,
    required:[true,'numero de siret requis'],
  },

  mail:{
    type:String,
    required:[true,'mail requis'],
  },

  pdgName:{
    type:String,
    required:[true, 'nom du directeur requis'],
  },

  password:{
    type:String,
    required:[true, 'mot de passe requis']
  }

})


const compagnyModel = mongoose.model ('compagnys', compagnySchema);
module.exports = compagnyModel;