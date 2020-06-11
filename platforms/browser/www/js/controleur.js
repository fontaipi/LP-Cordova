////////////////////////////////////////////////////////////////////////////////
// On définit un objet controleur qui va contenir les controleurs de nos pages
////////////////////////////////////////////////////////////////////////////////

var controleur = {};

////////////////////////////////////////////////////////////////////////////////
// Session : variables qui représentent l'état de l'application
////////////////////////////////////////////////////////////////////////////////

controleur.session = {
    partieEnCours: null, // La partie en train d'être jouée
    imageJ1: null,
    imageJ2: null
};

////////////////////////////////////////////////////////////////////////////////
// initialise : exécuté au démarrage de l'application (voir fichier index.js)
////////////////////////////////////////////////////////////////////////////////

controleur.init = function () {
    // On duplique Header et Footer sur chaque page (sauf la première !)
    $('div[data-role="page"]').each(function (i) {
        if (i > 0)
            $(this).html($('#shifumiHeader').html() + $(this).html() + $('#shifumiFooter').html());
    });
    // On afficher la page d'accueil
    $.mobile.changePage("#vueAccueil");
};

////////////////////////////////////////////////////////////////////////////////
// Controleurs de pages : 1 contrôleur par page, qui porte le nom de la page
//  et contient les callbacks des événements associés à cette page
////////////////////////////////////////////////////////////////////////////////

controleur.vueAccueil = {
    init: function () {
    },

    nouvellePartie: function () {
        // on récupère de l'information de la vue en cours
        var nomJoueur1 = $("#nomJoueur1").val();
        var nomJoueur2 = $("#nomJoueur1").val();
        if (nomJoueur1 === "" || nomJoueur2 === "") {
            if (nomJoueur1 === "") {
                alert("Entrez un nom de joueur 1 svp");
            }
            if (nomJoueur2 === "") {
                alert("Entrez un nom de joueur 2 svp");
            }
        } else {
            var joueur1 = modele.Joueur(nomJoueur1)
            var joueur2 = modele.Joueur(nomJoueur2)
            controleur.session.partieEnCours = modele.Partie(joueur1, joueur2)

            // Et on passe à une autre vue
            $.mobile.changePage("#vueJeu");
        }
    },

    photos: function (joueur) {
        // Appel méthode du modèle permettant de prendre une photo
        // en lui passant en paramètre successCB et errorCB
        modele.photos(
            // successCB : on met à jour la vue (champ cameraImage)
            function (img) {
                if (joueur == "j1") {
                    $("#joueur1").attr("src", img.getBase64());
                    controleur.session.imageJ1 = img
                } else {
                    $("#joueur2").attr("src", img.getBase64());
                    controleur.session.imageJ2 = img
                }
            },
            // erreurCB : on affiche un message approprié
            function () {
                plugins.toast.showShortCenter(
                    "Impossible de prendre une photo");
            }
        );
    },

};
// On définit ici la callback exécutée au chargement de la vue Accueil
$(document).on("pagebeforeshow", "#vueAccueil", function () {
    controleur.vueAccueil.init();
});


////////////////////////////////////////////////////////////////////////////////
controleur.vueJeu = {

    init: function () {
        // on active et on montre tous les boutons du joueur
        $("button[id^=joueur]").prop('disabled', false).show();
        // on cache toutes les réponses de la machine
        $("img[id^=machine]").hide();
        // on cache la div resultat
        $("#resultat").hide();
    },

    jouer: function (coupJoueur) {
        modele.morpion[coupJoueur] = "J1";
    },

    nouveauCoup: function (idCase) {
        let img;
        if (modele.tourJoueur === 1) {
            modele.tourJoueur = 2;
            img = controleur.session.imageJ1;
            modele.morpion[idCase] = "J1";
            console.log(controleur.vueJeu.checkWin('J1'));

        } else if (modele.tourJoueur === 2) {
            modele.tourJoueur = 1;
            img = controleur.session.imageJ2;
            modele.morpion[idCase] = "J2";
            console.log(controleur.vueJeu.checkWin('J2'));
        }


        $("#case-" + idCase + "-img").attr("src", img.getBase64());
        $("#case-" + idCase).removeAttr('onclick');

    },

    checkWin: function (player) {
        const horizontal = [0,3,6].map(i=>{return[i,i+1,i+2]});
        const vertical = [0,1,2].map(i=>{return[i,i+3,i+6]});
        const diagonal = [[0,4,8],[2,4,6]];
        const board = modele.morpion;

        var allwins = [].concat(horizontal).concat(vertical).concat(diagonal);

        let res = allwins.some(indices => {
            return board[indices[0]] == player && board[indices[1]] == player && board[indices[2]] == player})
        return res;
    },

    finPartie: function () {
        $.mobile.changePage("#vueFin");
    }
};

// On définit ici la callback exécutée au chargement de la vue Jeu
$(document).on("pagebeforeshow", "#vueJeu", function () {
    controleur.vueJeu.init();
});

////////////////////////////////////////////////////////////////////////////////
controleur.vueFin = {
    init: function () {
        $("#nbVictoires").html(controleur.session.partieEnCours.nbVictoires);
        $("#nbNuls").html(controleur.session.partieEnCours.nbNuls);
        $("#nbDefaites").html(controleur.session.partieEnCours.nbDefaites);
    },

    retourJeu: function () {
        $.mobile.changePage("#vueJeu");
    },

    retourAccueil: function () {
        $.mobile.changePage("#vueAccueil");
    }
};

// On définit ici la callback exécutée au chargement de la vue Fin
$(document).on("pagebeforeshow", "#vueFin", function () {
    controleur.vueFin.init();
});