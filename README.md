# ariane

Projet Github du projet Ariane (objet connecté + Scratch) pour le Hackathon Air France

- Dossier Scratch : 
 - Contient le code généré en XMl et JS par la plateforme de notre partenaire
 - Contient le code Scratch développé avec le GUI, sous forme de screenshots
 
 Ce dossier est séparé en 2 versions : la première qui était censée être dynamique mais que nous avons abandonné à cause des problèmes techniques, et la v2 qui est la version de la démonstration.

- Dossier Backoffice : Contient le front-end angular/bootstrap/AF betty qui permet de :
 - Lancer le processus Ariane
 - D'enroller des POPS
 - Visualiser l'historique des décisions
 - Envoyer un message au POPS

- Dossier Backend : Contient le backend node.js qui :
 - Fourni une API (données mock) a l'appli Backoffice
 - Communique avec le POPS via l'API Orange
 - Implemente des appels a l'API Flight Status d'Air France
