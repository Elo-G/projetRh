//fichier dans lequel je vais utiliser multer qui permet d'uploader des images et des fichier(à l'utilisateur de poster des fichiers)  
/*(L'upload de fichier consiste à transférer un fichier de l'ordinateur de l'utilisateur vers 
le serveur web (il s'agit de l'opération inverse du téléchargement ou terme anglais download). 
Ceci peut vous permettre de proposer à un utilisateur de mettre en ligne des photos, des images.)*/ 

const multer = require('multer'); // require ('multer' donc va falloir installer multer npm i etc... )

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',// Là JE MET TOUS LES FORMATS DE fichier que je vais vouloir  utiliser
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => { //fonction definissant la destination du fichier que le client nous a envoyé (uploadé)
    callback(null, './assets/uploads/');
  },
  filename: (req, file, callback) => {  //fonction qui defini le nom que prendra le fichier uploadé par le client
    const name = file.originalname.split(' ').join('_'); //on remplace les espace par des "_" dans le nom du fichier original
    const extension = MIME_TYPES[file.mimetype];// on recupere l'extension du fichier
    callback(null, name + Date.now() + '.' + extension); 
  }
});

const upload = multer({  //middleware qui permet d'uploadé des fichier
  storage: storage, 
  limits:{
    fieldSize:1024*1024*3
  }
})

module.exports = upload