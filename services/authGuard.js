const compagnyModel = require('../Models/compagnyModel')

let authGuard = async(req,res,next)=>{
    let compagny = await compagnyModel.findOne({_id: req.session.compagnyId})
    if (compagny) {
        next()
    }else{
        res.redirect('/')
    }
}

module.exports = authGuard