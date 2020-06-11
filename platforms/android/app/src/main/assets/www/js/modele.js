var modele = {};


//Class Partie
// Le modele contient ici une seule classe : Partie
modele.Partie = function (joueur1,joueur2) {
    // atributs
    this.joueur1 = joueur1
    this.joueur2 = joueur2
    this.morpion = ["","","","","","","","",""]
    this.tourJoueur = 1;
};


// constantes de classe


// Méthodes
modele.Partie.prototype = {
    nouveauCoup: function (coupJoueur) { // détermine le résulat d'un nouveau coup et sauvegarde le score

    },
};

modele.Joueur = function (nomJoueur) {
    this.nomJoueur = nomJoueur;
    this.nbVictoiresJoueur = 0;
    this.nbDefaitesJoueur = 0;
    this.nbNulsJoueur = 0;
    this.image = "";
};

modele.Joueur.prototype = {
};

modele.Image = function (id, imageData) {
// Attributs
    this.id = id;
    this.imageData = imageData; // l'image Base64
//
// Méthode pour obtenir l'image au format Base64 (décompressé) avec en-tête MIME
    this.getBase64 = function () {
        return "data:image/jpeg;base64," + this.imageData;
    },
// Méthode pour insérer une nouvelle image en BD
        this.insert = function (successCB, errorCB) {
            var self = this; // pour accéder à l'objet Image dans le succesCB de la requête insert
        };
};

modele.photos = function (successCB, errorCB) {
    navigator.camera.getPicture(
        function (imageData) {
        // imageData contient l'image capturée au format Base64, sans en-tête MIME
        // On appelle successCB en lui transmettant une entité Image
            successCB.call(this, new modele.Image(0, imageData));
        },
        function (err) {
            console.log("Erreur Capture image : " + err.message);
            errorCB.call(this);
        },
        {quality: 50, destinationType: navigator.camera.DestinationType.DATA_URL}
// qualité encodage 50%, format base64 (et JPEG par défaut)
    );
};

// Objet dao pour gérer la Persistance des parties dans le local storage.
// On stocke des paires (nomJoeur, partie).
modele.dao = {

    savePartie: function (partie) { // sauvegarde la partie au format JSON dans le local storage
        window.localStorage.setItem(partie.nomJoueur, JSON.stringify(partie));
    },

    loadPartie: function (nomJoueur) { // charge la partie d'un joueur, si elle existe, depuis le local storage
        var partie = window.localStorage.getItem(nomJoueur);
        if (partie === null) { // s'il n'y a pas de partie au nom de ce joueur, on en crée une nouvelle
            return new modele.Partie(nomJoueur, 0, 0, 0);
        } else { // sinon on convertit la partie au format JSON en objet JS de la classe Partie
            partie = JSON.parse(partie); // convertit la chaine JSON en objet JS
            Object.setPrototypeOf(partie, modele.Partie.prototype); // attache le prototype Partie à l'objet
            return partie;
        }
    }
};
