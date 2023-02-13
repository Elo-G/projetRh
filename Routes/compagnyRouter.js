//fichier où je crée les routes pour l'inscription des entreprises



const compagnyModel = require ("../Models/compagnyModel");
const compagnyRouter = require ("express").Router();
const crypto = require('../services/crypto')

//-------------------------ROUTES POUR ENREGISTREMENT DES ENTREPRISES-------------------------------------------------


//route pour afficher à l'entreprise le formulaire d'inscription qui est sur addCompagny.twig:
compagnyRouter.get ("/registrerCompagny", async (req,res)=> {
    res.render ("formRegistrer.twig"); //rend la page où se trouve le form d'inscription des Entreprises
})


//route pour poster les données saisies ds le form d'inscription par les entreprise  :
compagnyRouter.post ("/registrerCompagny", async (req, res)=>{
try {
    req.body.password= await crypto.cryptPassword(req.body.password) //le password ds le body de ma req sera = mot de passe crypté
    let newCompagny= new compagnyModel(req.body)
    await newCompagny.save()
    res.redirect ('/main')
} catch (error) {
    res.send(error)
}
})

 //-------------------------ROUTES POUR CONNEXION DES ENTREPRISES-------------------------------------------------


//route pour afficher à l'entreprise le formulaire de connexion qui est sur login.twig:
compagnyRouter.get("/login",async(req,res)=>{
    try{
        res.render ("login.twig"); 
    }
    catch(error){
        res.send(error)
    }    
    })


//route pour que l'entreprise se connecte :
compagnyRouter.post("/login",async(req,res)=>{
    const compagny = await compagnyModel.findOne({ mail: req.body.mail})
    if (compagny){
        if (await crypto.comparePassword(req.body.password, compagny.password)){//si le password crypté ds le body de la req (mdp enregistré crypté ds la bdd)), est le même que celui saisi  par l'entreprise (qd elle essaie de se connecter),
            req.session.compagnyId = compagny._id //garde en session l'entreprise qui a pour id l'id =._id
            res.redirect('/main')//et redirige la vers la page d'acceuil de l'appli
        }else{
            try{ res.render('login.twig',{ // rend ('la page login' ,"et execute {errConnect pr m'afficher le msg d'erreur}")
                errConnect: "le mot de passe est  incorrect !!!!!" 
                })  
            }catch(error){
                res.send(error)
            }
        }
    }else{ // et si tu trouve pas d'utilisateur, tu me redirige aussi à ma page d'erreur
           res.render('login.twig',{    
           errConnect: "l'utilisateur n'existe pas !!!!"/*errConnect est une clé */
            })   
        }
})



//route pour que l'entreprise se déconnecte :
compagnyRouter.get("/logout", async (req, res) => {
    req.session.destroy()
    res.redirect("/")//ATTENTION  res.redirect c'est pour te redirriger vers une route alors que res.render pour rendre une page
   });
  



module.exports= compagnyRouter;