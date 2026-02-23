# Progression STI2D 2024-2026

Documentation interactive et ressources pédagogiques pour la formation STI2D (Sciences et Technologies de l'Industrie et du Développement Durable).

## 🚀 Installation

```bash
npm install
```

## 🔧 Configuration

### API Gemini (Générateur de scénarios)

Le générateur de scénarios utilise l'API Gemini 2.5 Flash pour créer des exercices techniques adaptés aux systèmes STI2D.

1. Créez un fichier `.env` à la racine du projet :
```bash
cp .env.example .env
```

2. Ajoutez votre clé API Gemini :
```
GEMINI_API_KEY=votre_clé_api_ici
```

> 💡 Obtenez une clé API gratuite sur [Google AI Studio](https://aistudio.google.com/app/apikey)

## 📦 Commandes disponibles

### Développement

```bash
# Démarrer le proxy AI (générateur de scénarios)
npm run start:ai

# Builder les applications React
npm run build

# Serveur de documentation local
mkdocs serve
```

### Déploiement

```bash
# Déploiement complet (build + gh-pages)
npm run deploy:strict:safe

# Déploiement MkDocs uniquement
npm run deploy:safe
```

## 🎯 Fonctionnalités

### Générateur de scénarios intelligent

L'application [app.md](docs/chaine_info/app.md) génère automatiquement des exercices pédagogiques sur les chaînes d'information et d'énergie :

- **Intelligence artificielle** : Utilise Gemini 2.5 Flash pour générer des composants techniques précis
- **Fallback local** : Générateur contextuel si l'API est indisponible
- **7 blocs fonctionnels** : Acquérir, Traiter, Communiquer, Alimenter, Distribuer, Convertir, Transmettre
- **Composants industriels réels** : Capteurs, actionneurs, bus de communication standardisés

#### Exemples de systèmes pris en charge

- Drone (GNSS, ESC, moteurs brushless)
- Robot aspirateur (LIDAR, Wi-Fi, batteries Li-ion)
- Pompe à chaleur (NTC, Modbus, compresseur Scroll)
- Machine à café (microcontrôleur, relais SSR, thermobloc)
- Convoyeur industriel (photoélectrique, API, variateur)
- Et bien plus...

### Applications interactives

- **EnergyChainApp** : Exercices sur chaînes fonctionnelles
- **MechanicsApp** : Simulateurs mécaniques
- **Quiz STI2D** : Évaluations interactives

## 🌐 Déploiement

Site déployé sur GitHub Pages : https://xavierfrassinelli.github.io/Progression-STI2D-2026/

## 📚 Structure du projet

```
├── docs/               # Documentation MkDocs
│   ├── assets/        # Applications React compilées
│   ├── chaine_info/   # Exercices chaînes fonctionnelles
│   └── js/            # Scripts JavaScript
├── scripts/           # Scripts Node.js (ai-proxy.mjs)
├── site/              # Build MkDocs (non versionné)
├── mkdocs.yml         # Configuration MkDocs
└── package.json       # Dépendances npm
```

## 🔒 Sécurité

- ⚠️ **Ne commitez jamais votre fichier `.env`** (contient votre clé API)
- Le fichier `.env` est automatiquement ignoré par Git
- Utilisez `.env.example` comme template pour les autres contributeurs

## 📝 Licence

Projet éducatif - Jules Haag STI2D 2024-2026
