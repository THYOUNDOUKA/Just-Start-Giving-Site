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