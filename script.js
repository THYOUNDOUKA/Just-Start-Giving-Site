// ===== FONCTION RÉUTILISABLE : AFFICHER UN TOAST TEMPORAIRE =====
function afficherToast(message, estUneErreur = false) {
  const toast = document.querySelector('#toast-notification');

  toast.textContent = message;
  toast.hidden = false;
  toast.classList.toggle('toast-erreur', estUneErreur);

  // Force le navigateur à "voir" le hidden avant d'ajouter la classe visible,
  // sinon la transition CSS ne se joue pas correctement
  setTimeout(function() {
    toast.classList.add('toast-visible');
  }, 10);

  // Cache le toast après 3 secondes (ajustez si vous voulez vraiment 30s)
  setTimeout(function() {
    toast.classList.remove('toast-visible');
    setTimeout(function() {
      toast.hidden = true;
    }, 400); // attend la fin de la transition avant de vraiment cacher
  }, 3000);
}

// ===== NAVIGATION ENTRE LES SECTIONS =====
const liens = document.querySelectorAll('.lien-nav');   // ← voit header ET footer
const pages = document.querySelectorAll('.page');

liens.forEach(lien => {
  lien.addEventListener('click', function(event) {
    event.preventDefault();
    const cible = this.getAttribute('href').substring(1);

    pages.forEach(page => {
      page.hidden = (page.id !== cible);
    });

    // Si le lien a un data-cible (ex: un pilier précis), on scrolle vers lui
    const sousCible = this.getAttribute('data-cible');

    if (sousCible) {
      setTimeout(function() {
        document.getElementById(sousCible).scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// ===== CARROUSEL AUTOMATIQUE (glissement) =====
const piste = document.querySelector('.carrousel-piste');
const slides = document.querySelectorAll('.slide');
let indexActuel = 0;

setInterval(function() {
  indexActuel = (indexActuel + 1) % slides.length;
  piste.style.transform = `translateX(-${indexActuel * 100}%)`;
}, 4000);

// ===== BOUTON RETOUR EN HAUT =====
const boutonHaut = document.querySelector('#retour-haut');

// Affiche le bouton seulement après avoir scrollé un peu
window.addEventListener('scroll', function() //Détecte chaque fois que l'utilisateur fait défiler la page
 {
    //La distance (en pixels) déjà scrollée depuis le haut de la page
  if (window.scrollY > 400) {
    boutonHaut.style.display = 'flex';
  } else {
    boutonHaut.style.display = 'none';
  }
});

// Au clic, remonte en douceur tout en haut
boutonHaut.addEventListener('click', function() {
    //Pour remonter la page en haut, avec une animation fluide plutôt qu'un saut brusque
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonter la page vers le haut.
});

// ===== ONGLETS ANNÉES (Semaine Solidaire de la Rentrée) =====
const ongletsAnnees = document.querySelectorAll('.onglet-annee');
const contenusAnnees = document.querySelectorAll('.annee-contenu');

ongletsAnnees.forEach(onglet => {
  onglet.addEventListener('click', function() {
    const anneeChoisie = this.getAttribute('data-annee');

    // Retire "active" de tous les onglets, l'ajoute seulement au bon
    ongletsAnnees.forEach(o => o.classList.remove('active'));
    this.classList.add('active');

    // Cache tous les contenus, affiche seulement celui de l'année choisie
    contenusAnnees.forEach(contenu => {
      contenu.hidden = (contenu.id !== `annee-${anneeChoisie}`);
    });
  });
});

// ============================================================
// ===== MON ESPACE JSG ========================================
// ============================================================


// ===== CONNEXION SIMULÉE À MON ESPACE JSG =====

// On récupère le formulaire de connexion
const formConnexion = document.querySelector('#form-connexion');

// On récupère la zone de connexion
const espaceConnexion = document.querySelector('#espace-connexion');

// On récupère le tableau de bord qui est caché au départ
const espaceTableauBord = document.querySelector('#espace-tableau-bord');


let roleConnecte = null;

if (formConnexion) {
  formConnexion.addEventListener('submit', function(event) {
    event.preventDefault();

    const emailSaisi = document.querySelector('#connexion-email').value;
    const comptes = JSON.parse(localStorage.getItem('jsg-comptes')) || [];
    const compteTrouve = comptes.find(compte => compte.email === emailSaisi);

    roleConnecte = compteTrouve ? compteTrouve.role : document.querySelector('#connexion-role').value;

    // ===== RÉINITIALISATION DES DONNÉES AFFICHÉES =====
    // On efface d'abord tout, pour ne jamais garder les infos de la personne précédente
    const prenomAffiche = compteTrouve ? compteTrouve.prenom : 'utilisateur';

    document.querySelector('#prenom-utilisateur').textContent = prenomAffiche;
    document.querySelector('#profil-affiche-prenom').textContent = prenomAffiche;
    document.querySelector('#profil-affiche-nom').textContent = compteTrouve ? '' : 'Nom';
    document.querySelector('#profil-affiche-email').textContent = compteTrouve ? compteTrouve.email : emailSaisi;

    // Réinitialise aussi l'avatar (au cas où la personne précédente avait ajouté une photo)
    const avatarMini = document.querySelector('#espace-avatar-mini-affichage');
    avatarMini.style.backgroundImage = '';
    avatarMini.innerHTML = '<i class="fa-solid fa-user"></i>';

    // Réinitialise l'historique des collectes (admin) pour ne pas mélanger les sessions
    collectes = [];
    if (historiqueCollecte) {
      historiqueCollecte.innerHTML = '';
    }
    if (typeof recalculerCollecte === 'function') {
      recalculerCollecte();
    }

    espaceConnexion.hidden = true;
    espaceTableauBord.hidden = false;

    const formulaireCollecteAdmin = document.querySelector('#collecte-formulaire-admin');
    if (formulaireCollecteAdmin) {
      formulaireCollecteAdmin.hidden = (roleConnecte !== 'admin');
    }

    boutonsEspaceMenu.forEach(bouton => {
      const rolesAutorises = bouton.getAttribute('data-roles').split(',');
      bouton.style.display = rolesAutorises.includes(roleConnecte) ? 'flex' : 'none';
    });

    sectionsEspace.forEach(section => section.hidden = true);
    document.querySelector('#espace-dashboard').hidden = false;
    boutonsEspaceMenu.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-espace="dashboard"]').classList.add('active');
  });
}

// ===== NAVIGATION À L'INTÉRIEUR DE MON ESPACE JSG =====

// Récupère tous les boutons du menu latéral
const boutonsEspaceMenu = document.querySelectorAll('.bouton-espace-menu');

// Récupère toutes les sous-sections du tableau de bord
const sectionsEspace = document.querySelectorAll('.espace-section');


boutonsEspaceMenu.forEach(bouton => {

  bouton.addEventListener('click', function() {

    // Récupère le nom de la section demandée grâce à data-espace
    const espaceChoisi = this.getAttribute('data-espace');


    // Retire la classe active de tous les boutons du menu
    boutonsEspaceMenu.forEach(b => {

      b.classList.remove('active');

    });


    // Ajoute la classe active uniquement au bouton qui vient d'être cliqué
    this.classList.add('active');


    // Cache toutes les sous-sections
    sectionsEspace.forEach(section => {

      section.hidden = true;

    });


    // Recherche la section correspondante
    const sectionChoisie = document.querySelector(
      `#espace-${espaceChoisi}`
    );


    // Affiche seulement la section choisie
    if (sectionChoisie) {

      sectionChoisie.hidden = false;

    }

  });

});

// ===== BOUTON "VOIR LA GALERIE" DU TABLEAU DE BORD =====

// Récupère le bouton situé sur le tableau de bord
const boutonAllerGalerie = document.querySelector('.bouton-aller-galerie');


if (boutonAllerGalerie) {

  boutonAllerGalerie.addEventListener('click', function() {

    // Cache toutes les sections de Mon Espace JSG
    sectionsEspace.forEach(section => {

      section.hidden = true;

    });

    // Affiche directement la Galerie
    const galerie = document.querySelector('#espace-galerie');

    if (galerie) {

      galerie.hidden = false;

    }

    // Retire la classe active de tous les boutons du menu
    boutonsEspaceMenu.forEach(bouton => {

      bouton.classList.remove('active');

    });

    // Active visuellement le bouton Galerie du menu
    const boutonGalerie = document.querySelector(
      '[data-espace="galerie"]'
    );

    if (boutonGalerie) {

      boutonGalerie.classList.add('active');

    }

  });

}

// ===== GALERIE DES COLLECTES =====

// Récupère tous les boutons Collecte 2024, 2025, 2026, etc.
const boutonsGalerie = document.querySelectorAll('.galerie-entete');


boutonsGalerie.forEach(bouton => {

  bouton.addEventListener('click', function() {

    // Récupère l'id du contenu correspondant à la collecte
    const galerieCible = this.getAttribute('data-galerie');

    // Recherche le contenu correspondant
    const contenuGalerie = document.getElementById(galerieCible);

    // Récupère le symbole + situé dans le bouton
    const symbole = this.querySelector('.galerie-plus');


    if (contenuGalerie) {

      // Si la galerie est cachée
      if (contenuGalerie.hidden) {

        // On l'affiche
        contenuGalerie.hidden = false;

        // Le + devient un signe -
        symbole.textContent = '−';

      } else {

        // Si elle était déjà affichée, on la cache
        contenuGalerie.hidden = true;

        // Le signe - redevient +
        symbole.textContent = '+';

      }

    }

  });

});

// ===== FORMULAIRE DE PRIÈRE =====

// Récupère le formulaire de prière
const formPriere = document.querySelector('#form-priere');


if (formPriere) {

  formPriere.addEventListener('submit', function(event) {

    // Empêche le rechargement de la page
    event.preventDefault();


    // Pour le prototype on affiche seulement un message.
    // Plus tard le sujet sera envoyé au backend puis enregistré
    // dans la base de données.

    alert(
      'Votre sujet de prière a bien été envoyé. 🙏'
    );


    // Vide le formulaire après l'envoi
    formPriere.reset();

  });

}

// ===== DÉCONNEXION DE MON ESPACE JSG =====

// Récupère le bouton Déconnexion
const boutonDeconnexion = document.querySelector('#bouton-deconnexion');


if (boutonDeconnexion) {

  boutonDeconnexion.addEventListener('click', function() {

    // Cache le tableau de bord personnel
    espaceTableauBord.hidden = true;

    // Réaffiche le formulaire de connexion
    espaceConnexion.hidden = false;
    formConnexion.reset(); // S'assure de rénitialiser le formulaire de connexion après la déconnexion pour éviter que les données du dernier utilisateur à etre connecté ne reste afficher 

    // Remet le tableau de bord comme section active
    sectionsEspace.forEach(section => {

      section.hidden = true;

    });

    const dashboard = document.querySelector('#espace-dashboard');

    if (dashboard) {

      dashboard.hidden = false;

    }

    // Réinitialise aussi le bouton actif dans le menu
    boutonsEspaceMenu.forEach(bouton => {

      bouton.classList.remove('active');

    });

    const boutonDashboard = document.querySelector(
      '[data-espace="dashboard"]'
    );

    if (boutonDashboard) {

      boutonDashboard.classList.add('active');

    }

  });

}
// ===== PHOTO DE PROFIL MINIATURE (barre "Bonjour, Theresa") =====
const inputAvatarMini = document.querySelector('#espace-avatar-mini-input');
const avatarMiniAffichage = document.querySelector('#espace-avatar-mini-affichage');

if (inputAvatarMini) {
  inputAvatarMini.addEventListener('change', function() {
    const fichier = this.files[0];
    if (fichier) {
      const lecteur = new FileReader();
      lecteur.onload = function(e) {
        avatarMiniAffichage.style.backgroundImage = `url(${e.target.result})`;
        avatarMiniAffichage.style.backgroundSize = 'cover';
        avatarMiniAffichage.style.backgroundPosition = 'center';
        avatarMiniAffichage.innerHTML = '';
      };
      lecteur.readAsDataURL(fichier);
    }
  });
}
// Pour la partie modification du profil
// ===== MODIFIER MON PROFIL (édition locale, pas encore sauvegardée en base) =====
const boutonModifierProfil = document.querySelector('#bouton-modifier-profil');
const boutonAnnulerProfil = document.querySelector('#bouton-annuler-profil');
const profilAffichage = document.querySelector('#profil-affichage');
const formProfil = document.querySelector('#form-profil');

if (boutonModifierProfil) {
  boutonModifierProfil.addEventListener('click', function() {
    profilAffichage.hidden = true;
    formProfil.hidden = false;
  });
}

if (boutonAnnulerProfil) {
  boutonAnnulerProfil.addEventListener('click', function() {
    formProfil.hidden = true;
    profilAffichage.hidden = false;
  });
}

if (formProfil) {
  formProfil.addEventListener('submit', function(event) {
    event.preventDefault();

    const nouveauPrenom = document.querySelector('#profil-input-prenom').value;
    const nouveauNom = document.querySelector('#profil-input-nom').value;
    const nouvelEmail = document.querySelector('#profil-input-email').value;

    document.querySelector('#profil-affiche-prenom').textContent = nouveauPrenom;
    document.querySelector('#profil-affiche-nom').textContent = nouveauNom;
    document.querySelector('#profil-affiche-email').textContent = nouvelEmail;

    // Met aussi à jour "Bonjour, [Prénom]" dans la barre d'en-tête
    document.querySelector('#prenom-utilisateur').textContent = nouveauPrenom;

    formProfil.hidden = true;
    profilAffichage.hidden = false;
  });
}

// ===== GRAPHIQUE : ÉVOLUTION DE MES DONS (Chart.js) =====
const canvasMesDons = document.querySelector('#graphique-mes-dons');

if (canvasMesDons) {
  new Chart(canvasMesDons, {
    type: 'bar',
    data: {
      labels: ['Août 2024', 'Déc 2025', 'Août 2026'],
      datasets: [{
        label: 'Montant donné ($)',
        data: [75, 200, 150],
        backgroundColor: '#1e3a8a',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) { return value + ' $'; }
          }
        }
      }
    }
  });
}
// ===== COLLECTE FINANCIÈRE (admin) =====
const formCollecte = document.querySelector('#form-collecte');
const historiqueCollecte = document.querySelector('#collecte-historique');
const canvasCollecteDepenses = document.querySelector('#graphique-collecte-depenses');

let collectes = []; // stocké seulement en mémoire pour l'instant, pas de base de données

let graphiqueDepenses = null;

if (canvasCollecteDepenses) {
  graphiqueDepenses = new Chart(canvasCollecteDepenses, {
    type: 'pie',
    data: {
      labels: ['Vêtements', 'Kits scolaires', 'Nourriture', 'Transport', 'Autre'],
      datasets: [{
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#E91E8C', '#1e3a8a', '#f4a261', '#2a9d5c', '#999999']
      }]
    },
    options: {
      responsive: true
    }
  });
}
function recalculerCollecte() {

  let totalRecu = 0;
  let totauxParCategorie = { vetements: 0, kits: 0, nourriture: 0, transport: 0, autre: 0 };

  collectes.forEach(c => {
    totalRecu += c.recu;
    totauxParCategorie.vetements += c.depenses.vetements;
    totauxParCategorie.kits += c.depenses.kits;
    totauxParCategorie.nourriture += c.depenses.nourriture;
    totauxParCategorie.transport += c.depenses.transport;
    totauxParCategorie.autre += c.depenses.autre;
  });

  const totalDepense = Object.values(totauxParCategorie).reduce((a, b) => a + b, 0);
  const solde = totalRecu - totalDepense;

  document.querySelector('#collecte-total-recu').textContent = totalRecu + ' $';
  document.querySelector('#collecte-total-depense').textContent = totalDepense + ' $';
  document.querySelector('#collecte-solde').textContent = solde + ' $';

  if (graphiqueDepenses) {
    graphiqueDepenses.data.datasets[0].data = Object.values(totauxParCategorie);
    graphiqueDepenses.update();
  }
}

if (formCollecte) {
  formCollecte.addEventListener('submit', function(event) {
    event.preventDefault();

    const nouvelleCollecte = {
      nom: document.querySelector('#collecte-nom').value,
      recu: Number(document.querySelector('#collecte-montant-recu').value),
      depenses: {
        vetements: Number(document.querySelector('#depense-vetements').value),
        kits: Number(document.querySelector('#depense-kits').value),
        nourriture: Number(document.querySelector('#depense-nourriture').value),
        transport: Number(document.querySelector('#depense-transport').value),
        autre: Number(document.querySelector('#depense-autre').value)
      }
    };

    collectes.push(nouvelleCollecte);

    const totalDepenseCollecte = Object.values(nouvelleCollecte.depenses).reduce((a, b) => a + b, 0);

    const ligne = document.createElement('div');
    ligne.className = 'collecte-ligne-historique';
    ligne.innerHTML = `
      <div>
        <strong>${nouvelleCollecte.nom}</strong>
        <span class="collecte-ligne-detail">Reçu : ${nouvelleCollecte.recu} $ · Dépensé : ${totalDepenseCollecte} $</span>
      </div>
    `;
    historiqueCollecte.prepend(ligne);

    recalculerCollecte();
    formCollecte.reset();
  });
}

// ===== CRÉATION DE COMPTE (prototype localStorage) =====
const espaceCreation = document.querySelector('#espace-creation');
const lienCreerCompte = document.querySelector('#lien-creer-compte');
const lienRetourConnexion = document.querySelector('#lien-retour-connexion');
const formCreation = document.querySelector('#form-creation');
const creationMessage = document.querySelector('#creation-message');
const lienMotDePasseOublie = document.querySelector('#lien-mot-de-passe-oublie');

// Bascule vers le formulaire de création de compte
if (lienCreerCompte) {
  lienCreerCompte.addEventListener('click', function(event) {
    event.preventDefault();
    espaceConnexion.hidden = true;
    espaceCreation.hidden = false;
    formConnexion.reset(); // Pour ne pas garder d'anciennes valeurs si quelqu'un revenait en arrière après la création de son compte
  });
}

// Retour vers le formulaire de connexion
if (lienRetourConnexion) {
  lienRetourConnexion.addEventListener('click', function(event) {
    event.preventDefault();
    espaceCreation.hidden = true;
    espaceConnexion.hidden = false;
  });
}

// Soumission du formulaire de création de compte
if (formCreation) {
  formCreation.addEventListener('submit', function(event) {
    event.preventDefault();

    const nouveauCompte = {
      prenom: document.querySelector('#creation-prenom').value,
      email: document.querySelector('#creation-email').value,
      motdepasse: document.querySelector('#creation-password').value,
      role: document.querySelector('#creation-role').value
    };

    // Récupère les comptes déjà enregistrés (ou un tableau vide s'il n'y en a pas)
    const comptes = JSON.parse(localStorage.getItem('jsg-comptes')) || [];

    // Vérifie si l'email est déjà utilisé
    const emailExiste = comptes.some(compte => compte.email === nouveauCompte.email);

    if (emailExiste) {
      creationMessage.textContent = 'Un compte existe déjà avec cet e-mail.';
      creationMessage.style.color = '#ffb6d9';
      return;
    }

    // Ajoute le nouveau compte et sauvegarde
       comptes.push(nouveauCompte);
    localStorage.setItem('jsg-comptes', JSON.stringify(comptes));

    afficherToast(`Compte créé avec succès, ${nouveauCompte.prenom} ! Redirection...`);
    formCreation.reset();

    // Redirige automatiquement vers la connexion après un court délai  et s,assure de réinitialiser toutes les données qui étaient vant
    setTimeout(function() {
  espaceCreation.hidden = true;
  espaceConnexion.hidden = false;
  formConnexion.reset();   // ← nouvelle ligne : vide le formulaire de connexion
}, 1200);
  });
}
// Message temporaire pour "mot de passe oublié" (nécessite un vrai backend)
if (lienMotDePasseOublie) {
  lienMotDePasseOublie.addEventListener('click', function(event) {
    event.preventDefault();
    alert('Cette fonctionnalité sera disponible une fois notre système de compte sécurisé mis en place. Merci de votre patience !');
  });
}

