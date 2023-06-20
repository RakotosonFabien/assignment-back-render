#PROJET ANGULAR GESTION DE DEVOIRS AVER Mr Michel BUFFA

#ITUniversity MADAGASCAR - MBDS

#MEMBRES DU GROUPE
31 - Rakotoson Maminirina Fabien
40 - Ranaivoson Fenohasina Antonio

#Contributions
- Une gestion de login/password (collection MongoDB) et hachage du mot de passe
- Verification d'authentification : voir les pages (si connecte), modification et ajout (si admin)
- Ajout des nouvelles proprietes de devoir et conditions de rendu
- Affichage des listes des devoirs avec les nouvelles proprietes
- Couleur de note (< 10; < 12; < 15; > 15)
- Rendre un devoir et ajouter une note depuis la liste
- Gestion des modifications, suppression de devoirs

NB : Assignment, id est encore un generation de nombre aleatoire

#Nos collections
- USER contenant les informations des utilisateurs (prof, etudiant, admin)
- MATIERE contenant toutes les matieres
- ASSIGNMENTS contenant la liste des devoirs (avec association user, matiere)
- une vue qui va regrouper les informations d'un devoir et ses associations pour l'affichage des details dans les pages

##Demarrage du projet en local
Cloner les deux repository back et front

#BACK-END NodeJs Express
https://github.com/RakotosonFabien/assignment-app-mbds-back-40-31
Commandes :
npm install
node server.js
Le port en localhost configure est le port 8010
Pour verifier, allez sur http://localhost:8010/api/users

FRONTEND AngularJS
https://github.com/RakotosonFabien/assignment-app-mbds-40-31

Aller dans src/app/shared/outils.service.ts, decommenter la premiere base_url et commenter la deuxieme pour utiliser le serveur en localhost:8010

Commandes : 
npm intall
ng serve

Allez ensuite sur http://localhost:4200/

#Infos
#Description admin
email => admin@example.com
password => 123456