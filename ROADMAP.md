# Plan — Système de don JSG (Node.js + Express + PostgreSQL + Stripe)

Objectif : remplacer le formulaire statique par un vrai système de don avec
paiement réel et base de données, déployé avant **octobre**.

---

## 1. Stack technique

| Rôle | Techno | Pourquoi |
|---|---|---|
| Frontend | HTML / CSS / JS (déjà fait) | Ton site actuel, presque inchangé |
| Backend | Node.js + Express | Même langage que ton frontend (JS partout) |
| Base de données | PostgreSQL | La plus demandée sur le marché, bon exercice SQL |
| ORM (accès BD simplifié) | Prisma ou Sequelize | Évite d'écrire du SQL brut à la main partout |
| Paiement | Stripe Checkout | API bien documentée, mode test gratuit et illimité |
| Hébergement backend | Render ou Railway | Gratuit pour un petit projet, déploiement simple |
| Hébergement frontend | Vercel, Netlify, ou GitHub Pages | Gratuit, déjà compatible avec ton HTML/CSS/JS |

---

## 2. Structure de dossiers

```
jsg-site/
├── frontend/                 ← ton site actuel (index.html, style.css, script.js, images/)
│
└── backend/
    ├── .env                 ← clés secrètes (JAMAIS commit, voir section 6)
    ├── .gitignore
    ├── package.json
    ├── server.js             ← point d'entrée du serveur Express
    ├── routes/
    │   └── donations.js      ← les routes /api/donations
    ├── controllers/
    │   └── donationController.js
    ├── models/
    │   └── donation.js       ← schéma Prisma/Sequelize
    └── config/
        └── db.js             ← connexion à PostgreSQL
```

---

## 3. Schéma de base de données

Une seule table pour commencer, largement suffisante :

**Table `donations`**

| Colonne | Type | Description |
|---|---|---|
| id | UUID / serial | Identifiant unique |
| amount | integer | Montant en cents (ex: 2000 = 20,00 $ — évite les problèmes d'arrondi) |
| currency | varchar | "cad" |
| designation | varchar | "Offrandes", "Construction", "Terrain", etc. |
| donor_name | varchar (nullable) | Facultatif si don anonyme |
| donor_email | varchar (nullable) | Pour envoyer une confirmation |
| comment | text (nullable) | Le commentaire optionnel du formulaire |
| stripe_payment_id | varchar | ID de transaction Stripe (preuve du paiement) |
| status | varchar | "pending", "succeeded", "failed" |
| created_at | timestamp | Date du don |

**Point important** : tu ne stockes JAMAIS de numéro de carte bancaire dans cette
table. Stripe s'en charge entièrement — toi tu ne reçois qu'une confirmation.

---

## 4. Endpoints API à construire

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/donations/create-checkout-session` | Reçoit montant + désignation depuis le formulaire, crée une session Stripe, renvoie l'URL de paiement |
| POST | `/api/webhooks/stripe` | Stripe appelle cette route automatiquement quand un paiement réussit → tu enregistres le don en base |
| GET | `/api/donations` | (optionnel, protégé) liste des dons pour un futur tableau de bord admin |

**Flux complet :**
1. L'utilisateur choisit un montant sur ton site → clique "Suivant"
2. Ton JS frontend envoie une requête `fetch()` à `/api/donations/create-checkout-session`
3. Ton backend crée une session Stripe et redirige l'utilisateur vers la page de paiement sécurisée de Stripe
4. L'utilisateur paie sur Stripe (pas sur ton site — c'est Stripe qui gère les infos de carte)
5. Stripe notifie ton backend via un **webhook** que le paiement a réussi
6. Ton backend enregistre le don dans PostgreSQL et peut envoyer un email de remerciement

---

## 5. Feuille de route jusqu'à octobre

**Semaine 1-2 — Bases**
- Installer Node.js, PostgreSQL (ou utiliser une BD cloud gratuite type Supabase/Neon)
- `npm init`, installer Express, créer un serveur "Hello World"
- Se familiariser avec Prisma ou Sequelize

**Semaine 3 — Base de données**
- Créer la table `donations`
- Faire les opérations CRUD de base à la main pour comprendre (avant d'automatiser)

**Semaine 4-5 — Intégration Stripe**
- Créer un compte Stripe (mode test)
- Suivre leur doc officielle "Checkout" étape par étape
- Faire un premier paiement test avec une carte factice (4242 4242 4242 4242)

**Semaine 6 — Webhook**
- Configurer le webhook Stripe pour recevoir la confirmation de paiement
- Enregistrer automatiquement le don en base une fois confirmé

**Semaine 7 — Frontend**
- Remplacer l'iframe Zeffy par un vrai appel `fetch()` vers ton backend
- Gérer les cas d'erreur (paiement refusé, etc.)

**Semaine 8 — Déploiement**
- Backend sur Render/Railway
- Variables d'environnement configurées en prod
- Tester un vrai paiement de bout en bout

**Semaine 9-10 — Marge de sécurité**
- Tests, corrections de bugs, ajustements visuels
- Passage en mode Stripe "live" seulement quand tout est solide

---

## 6. Sécurité — à respecter dès le premier jour

Dans `backend/.gitignore` :
```
node_modules/
.env
```

Dans `backend/.env` (exemple, jamais commité) :
```
DATABASE_URL=postgresql://user:password@localhost:5432/jsg
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

Dans ton code, tu accèdes à ces valeurs via `process.env.STRIPE_SECRET_KEY`,
jamais écrites en dur dans le code.

---

## 7. Ressources pour apprendre en cours de route

- Doc officielle Stripe Checkout : https://docs.stripe.com/checkout/quickstart
- Doc Prisma (ORM) : https://www.prisma.io/docs
- Doc Express : https://expressjs.com/fr/
