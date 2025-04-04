<p align="center">
  <img src="../img/github_logo.png">
</p>

# Leviath
Bot Discord utilisé dans un serveur Multigaming.

Le but principal sera d'automatiser certaines tâches de recherches d'infos et la centralisation de celles-ci.</br>
Ensuite les features seront dev selon l'intérêt.

---

__Fonctions présentes:__
| Commandes Slash   | Descriptif                                         |
|:-----------------:|:---------------------------------------------------|
| `/addRSS`         | Ajoute le suivi d'actualités de l'URL spécifié     |
| `/clearMsg`       | Supprime tout les messages du jour                 |

| Commandes Texte | Descriptif                                                    |
|:---------------:|:--------------------------------------------------------------|
| `rules`         | Affiche le règlement du serveur                               |

| Événements               | Descriptif                                                           |
|:------------------------:|:---------------------------------------------------------------------|
|`DynamicVoiceChannel`     | Crée un nouveau salon vocal portant le nom de l'utilisateur          |
|`autoRole`                | Assigne automatiquement le rôle "Membre" à l'entrée dans le serveur  |

## Ressources

#### 📂 __[Structure du projet](./ProjectStructure.md)__

#### 🔧 __[Fonctionnalités en réflexion](./Features.md)__

#### 🔐 __[Permissions](./BotConfig.md)__

## Invitation Discord
#### 🤖 __[Leviath](https://discord.com/oauth2/authorize?client_id=1356445603583758357&permissions=582047826996343&integration_type=0&scope=bot)__
#### 🤖 __[Leviath[Dev]](https://discord.com/oauth2/authorize?client_id=1356448589248856085&permissions=582047826996343&integration_type=0&scope=bot)__

## Roadmap
🛠️ En développement</br>
⚠️ Correctif nécessaire</br>
📝 Planifié</br>
✅ Terminé</br>
🔄 Reporté</br>
⏸️ Arrêté</br>
❌ Annulé</br>

---

### Release v1.10.0:
| Version  | Objectif                                                         | État |
|:--------:|:-----------------------------------------------------------------|:----:|
| v1.0.0   | Initial Commit                                                   | ✅ |
| v1.1.0   | Affectation auto du rôle "Membre"                                | ✅ |
| v1.2.0   | Commande de suppression de messages                              | ✅ |
| v1.3.0   | Système RSS Feeds - structure globale                            | ✅ |
| v1.3.1   | Système RSS Feeds - gestion des données XML                      | 🛠️ |
| v1.3.2   | Système RSS Feeds - affichage des news dans un embed             | 📝 |
| v1.4.0   | eventHandler refactoring                                         | 📝 |
| v1.5.0   | Système de logs des membres: arrivée, listing selon rôles,..     | 📝 |
| v1.6.0   | Affichage des permissions du Bot centralisé                      | 📝 |
| v1.7.0   | Intégrer l'API d'un LLM de MistralAI                             | _ |


## License
Le projet Leviath est sous licence MIT.