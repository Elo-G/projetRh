const workerRouter = require("express").Router();
const workerModel = require("../models/workerModel");
const authGuard = require("../services/authGuard");
// const authGard = require ('../services/authGuard')
const upload = require("../services/uploadFile");

//route pour afficher mon formulaire employé(e)s:
workerRouter.get("/addWorker", async (req, res) => {
  res.render("form-addWorker.twig");
});

//route pour ajouter des employé(e)s: (les enregistrer ds la bdd)
workerRouter.post("/addWorker", authGuard, upload.single("img"), async (req, res) => {
  try {
    if (req.file) {
      //si fichier a été envoyé par client
      req.body.img = req.file.filename; //la clé "img", (qui est dans le corps de la requete) = au nom de fichier du fichier de la req (<=> = au nom du fichier uploadé)
    }
    req.body.compagnyId = req.session.compagnyId;
    let newWorker = new workerModel(req.body);
    await newWorker.save();
    res.redirect("/main");
  } catch (error) {
    res.send(error);
  }
});

workerRouter.get("/", async (req, res) => {
  res.render("index.twig");
});

//route pour afficher les employé(e)s enregistrés, dans le main.twig
workerRouter.get("/main", authGuard, async (req, res) => {
  let workers = await workerModel.find({ compagnyId: req.session.compagnyId });
  res.render("main.twig", {
    workers: workers,
  });
});
/* Rq: "ds workers:workers", le 1er workers c'est la clé et le deuxième c'est la valeur de la clé  qui est
    = la variable "workers= await workerstModel.find()" que j'ai déclaré en haut et cette clé */

//routes pour afficher le form contenant les données des employés
workerRouter.get("/updateWorker/:id",authGuard, async (req, res) => {
  try {
    let worker = await workerModel.findOne({ _id: req.params.id });
    console.log("hjzkvfkjqhsdkfj", worker);
    res.render("updateWorkerForm.twig", {
      //tu te rend sur cette page et tu affiche ces parametres
      tata: worker, // ces parametre c'est :la clé tata qui est = la variable worker déclarée plus haut (let worker== await workerModel.findOne({_id: req.params.id})
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//routes pour enregistrer les modification données des employés
workerRouter.post(
  "/updateWorker/:id",authGuard,
  upload.single("img"),
  async (req, res) => {
    if (req.file) {
      //si fichier a été envoyé par client
      req.body.img = req.file.filename; //la clé "img", (qui est dans le corps de la requete) = au nom de fichier du fichier de la req (<=> = au nom du fichier uploadé)
    }
    try {
      await workerModel.updateOne({ _id: req.params.id }, req.body);
      res.redirect("/main");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);

//route pour effacer les employés
workerRouter.get("/deleteWorker/:id",authGuard, async (req, res) => {
  try {
    await workerModel.deleteOne({ _id: req.params.id });
    res.redirect("/main");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//route pour BLAMER les employés
workerRouter.get("/addBlame/:id",authGuard, async (req, res) => {
    try {
     let worker = await workerModel.findOne({ _id: req.params.id });
     let blame =  worker.blameNumber
     blame = blame++
     if (blame >= 3) {
        res.redirect("/deleteWorker/"+req.params.id)
     }else{
        await workerModel.updateOne({ _id: req.params.id },{blameNumber: blame});
     }
      res.redirect("/main");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });



module.exports = workerRouter;
