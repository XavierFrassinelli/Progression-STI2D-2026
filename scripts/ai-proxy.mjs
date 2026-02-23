import http from 'node:http';

const PORT = Number(process.env.AI_PROXY_PORT || 8787);

const REQUIRED_BLOCKS = [
  'acquerir',
  'traiter',
  'communiquer',
  'alimenter',
  'distribuer',
  'convertir',
  'transmettre'
];

function writeJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });
  res.end(JSON.stringify(body));
}

function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function normalizePrompt(rawPrompt) {
  return rawPrompt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function inferDomain(prompt) {
  const normalized = normalizePrompt(prompt);

  const rules = [
    { key: 'drone', tags: ['drone', 'quadricoptere', 'multirotor'] },
    { key: 'convoyeur', tags: ['convoyeur', 'tapis roulant', 'chaine de tri', 'ligne de tri'] },
    { key: 'voiture_electrique', tags: ['voiture electrique', 'vehicule electrique', 'ev'] },
    { key: 'store_banne', tags: ['store', 'banne', 'auvent'] },
    { key: 'robot_aspirateur', tags: ['aspirateur', 'robot menager'] },
    { key: 'grille_pain', tags: ['grille-pain', 'grille pain', 'toaster'] },
    { key: 'pompe_eau', tags: ['pompe', 'relevage', 'circulation eau'] },
    { key: 'portail', tags: ['portail', 'barriere', 'garage'] },
    { key: 'ventilateur', tags: ['ventilateur', 'brasseur', 'aerateur'] }
  ];

  for (const rule of rules) {
    if (rule.tags.some((tag) => normalized.includes(tag))) {
      return rule.key;
    }
  }

  return 'unknown';
}

function toReadableSystemLabel(prompt) {
  const cleaned = String(prompt || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'système technique';
  }

  return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function buildPromptDrivenItems(prompt) {
  const normalized = normalizePrompt(prompt);
  const systemLabel = toReadableSystemLabel(prompt);

  if (includesAny(normalized, ['compresseur', 'pneumatique', 'air comprime', 'air comprimee', 'air'])) {
    return {
      acquerir: ['Pressostat', 'Capteur de pression de cuve'],
      traiter: ['Automate de compression', 'Régulateur électronique de pression'],
      communiquer: ['Bus Modbus RTU', 'Signal TOR vers coffret de commande'],
      alimenter: ['Alimentation triphasée 400V', 'Réseau 230V/400V + alimentation de commande 24V'],
      distribuer: ['Contacteur moteur', 'Démarreur progressif'],
      convertir: ['Moteur électrique du compresseur', 'Bloc compresseur à vis'],
      transmettre: ['Transmission courroie-poulies', `Arbre d’entraînement du ${systemLabel}`]
    };
  }

  if (includesAny(normalized, ['pompe', 'hydraulique', 'fluide', 'eau'])) {
    return {
      acquerir: ['Capteur de niveau', 'Capteur de pression hydraulique'],
      traiter: ['API de pompage', 'Carte de régulation débit/pression'],
      communiquer: ['Bus CANopen', 'Liaison de commande 4-20 mA'],
      alimenter: ['Alimentation moteur 400V', 'Bloc d’alimentation 24V commande'],
      distribuer: ['Électrovanne proportionnelle', 'Contacteur de puissance'],
      convertir: ['Moteur de pompe', 'Pompe centrifuge'],
      transmettre: ['Réseau de tuyauterie', 'Arbre + roue hydraulique']
    };
  }

  if (includesAny(normalized, ['chauffage', 'thermique', 'clim', 'temperature', 'four'])) {
    return {
      acquerir: ['Sonde de température PT100', 'Thermistance NTC'],
      traiter: ['Régulateur PID', 'Microcontrôleur de gestion thermique'],
      communiquer: ['Bus KNX/Modbus', 'Sortie de commande PWM'],
      alimenter: ['Alimentation secteur 230V', 'Alimentation 24V de régulation'],
      distribuer: ['Relais statique (SSR)', 'Carte de puissance triac'],
      convertir: ['Résistance chauffante', 'Compresseur frigorifique'],
      transmettre: ['Échangeur thermique', 'Ventilateur de soufflage']
    };
  }

  if (includesAny(normalized, ['robot', 'manipulateur', 'bras', 'cobot'])) {
    return {
      acquerir: ['Codeur absolu d’axe', 'Capteur de couple'],
      traiter: ['Contrôleur robotique', 'PLC de cellule robotisée'],
      communiquer: ['Bus EtherCAT', 'Réseau industriel Profinet'],
      alimenter: ['Alimentation 48V servomoteurs', 'Réseau triphasé 400V'],
      distribuer: ['Drive servo', 'Variateur multi-axes'],
      convertir: ['Servomoteur brushless', 'Actionneur électrique d’axe'],
      transmettre: ['Réducteur harmonique', `Chaîne cinématique du ${systemLabel}`]
    };
  }

  if (includesAny(normalized, ['vehicule', 'voiture', 'velo', 'trottinette', 'train', 'ascenseur'])) {
    return {
      acquerir: ['Capteur de vitesse', 'Capteur de position'],
      traiter: ['Calculateur embarqué', 'Contrôleur de traction'],
      communiquer: ['Bus CAN', 'Réseau Ethernet embarqué'],
      alimenter: ['Batterie de traction', 'Pack d’alimentation principal'],
      distribuer: ['Onduleur de puissance', 'Module de distribution HV'],
      convertir: ['Machine électrique de traction', 'Moteur brushless de propulsion'],
      transmettre: ['Réducteur + arbre de transmission', 'Train d’engrenages final']
    };
  }

  if (includesAny(normalized, ['convoyeur', 'tri', 'ligne', 'usine', 'machine'])) {
    return {
      acquerir: ['Capteur photoélectrique', 'Capteur inductif de présence'],
      traiter: ['Automate programmable', 'Contrôleur de ligne'],
      communiquer: ['Bus de terrain Modbus', 'Réseau Profinet'],
      alimenter: ['Réseau 230V/400V', 'Bloc d’alimentation 24V DC'],
      distribuer: ['Variateur de vitesse', 'Contacteur de puissance'],
      convertir: ['Motoréducteur', 'Moteur asynchrone'],
      transmettre: ['Bande transporteuse', `Rouleaux et courroies du ${systemLabel}`]
    };
  }

  return {
    acquerir: [`Capteur de position du ${systemLabel}`, `Capteur de mesure du ${systemLabel}`],
    traiter: [`Microcontrôleur de pilotage du ${systemLabel}`, `Unité de commande du ${systemLabel}`],
    communiquer: [`Bus de communication du ${systemLabel}`, `Interface de commande du ${systemLabel}`],
    alimenter: [`Alimentation principale du ${systemLabel}`, `Source d'énergie du ${systemLabel}`],
    distribuer: [`Carte de puissance du ${systemLabel}`, `Organe de commutation du ${systemLabel}`],
    convertir: [`Actionneur principal du ${systemLabel}`, `Convertisseur d'énergie du ${systemLabel}`],
    transmettre: [`Transmission mécanique du ${systemLabel}`, `Organe final du ${systemLabel}`]
  };
}

const SCENARIO_LIBRARY = {
  drone: {
    title: ['Drone Stabilisé', 'Drone de Surveillance'],
    instruction: ['Associez les composants du drone aux fonctions de la chaîne.'],
    items: {
      acquerir: ['Capteur de position (GNSS/GPS)', 'IMU (gyroscope + accéléromètre)', 'Capteur de pression/altimètre'],
      traiter: ['Contrôleur de vol (STM32)', 'Microcontrôleur de stabilisation'],
      communiquer: ['Bus ESC (PWM/DShot)', 'Liaison radio 2.4 GHz'],
      alimenter: ['Batterie LiPo 4S', 'Pack batterie Li-ion'],
      distribuer: ['ESC 4-en-1', 'Carte de distribution puissance (PDB)'],
      convertir: ['Moteurs brushless', 'Actionneur brushless triphasé'],
      transmettre: ['Hélices + arbre moteur', 'Hélices bi-pales']
    }
  },
  convoyeur: {
    title: ['Convoyeur de Tri', 'Ligne de Convoyage Automatisée'],
    instruction: ['Placez chaque élément du convoyeur dans la bonne fonction.'],
    items: {
      acquerir: ['Capteur photoélectrique', 'Détecteur de présence inductif'],
      traiter: ['Automate programmable (API/PLC)', 'Carte de commande logique'],
      communiquer: ['Bus de terrain Modbus', 'Sorties TOR de commande'],
      alimenter: ['Réseau 230V -> alimentation 24V', 'Bloc d’alimentation 24V DC'],
      distribuer: ['Contacteur moteur', 'Variateur de vitesse'],
      convertir: ['Moteur asynchrone', 'Motoréducteur électrique'],
      transmettre: ['Bande transporteuse + rouleaux', 'Poulies et courroie de convoyage']
    }
  },
  voiture_electrique: {
    title: ['Voiture Électrique', 'Chaîne EV de Traction'],
    instruction: ['Associez les éléments de traction et commande du véhicule électrique.'],
    items: {
      acquerir: ['Capteur pédale d’accélérateur', 'Capteurs vitesse roue'],
      traiter: ['Calculateur de traction (ECU)', 'BMS + contrôleur véhicule'],
      communiquer: ['Réseau CAN', 'Bus CAN-FD véhicule'],
      alimenter: ['Batterie haute tension', 'Pack batterie HV'],
      distribuer: ['Onduleur de puissance', 'Étage de puissance IGBT'],
      convertir: ['Moteur synchrone à aimants permanents', 'Machine électrique de traction'],
      transmettre: ['Réducteur + différentiel', 'Arbres de transmission']
    }
  },
  store_banne: {
    title: ['Store Banne Intelligent', 'Store Banne Automatique'],
    instruction: ['Complétez la chaîne de commande et d’énergie du store.'],
    items: {
      acquerir: ['Anémomètre', 'Capteur de luminosité'],
      traiter: ['Carte électronique de commande', 'Microcontrôleur embarqué'],
      communiquer: ['Liaison filaire de commande', 'Module radio RTS'],
      alimenter: ['Réseau 230V', 'Alimentation secteur'],
      distribuer: ['Relais inverseur', 'Module de puissance'],
      convertir: ['Moteur tubulaire', 'Moteur électrique'],
      transmettre: ['Bras articulés', 'Tube d’enroulement + mécanisme']
    }
  },
  robot_aspirateur: {
    title: ['Robot Aspirateur', 'Aspirateur Autonome'],
    instruction: ['Reliez les composants du robot aspirateur aux fonctions correctes.'],
    items: {
      acquerir: ['Capteurs infrarouges anti-chute', 'Capteur lidar simplifié'],
      traiter: ['Carte processeur embarquée', 'Microcontrôleur de navigation'],
      communiquer: ['Bus interne I2C/UART', 'Liaison Wi-Fi application'],
      alimenter: ['Batterie Li-ion', 'Pack batterie rechargeable'],
      distribuer: ['Carte de puissance moteurs', 'Driver moteurs DC'],
      convertir: ['Moteur d’aspiration', 'Moteur roues DC'],
      transmettre: ['Roues motrices + engrenages', 'Turbine d’aspiration']
    }
  },
  grille_pain: {
    title: ['Grille-pain Automatique', 'Grille-pain Contrôlé'],
    instruction: ['Placez les composants du grille-pain dans les fonctions adaptées.'],
    items: {
      acquerir: ['Thermistance de température', 'Capteur position levier'],
      traiter: ['Minuterie électronique', 'Carte logique de cycle'],
      communiquer: ['Signal de commande interne', 'Liaison carte -> actionneur'],
      alimenter: ['Réseau 230V', 'Alimentation secteur'],
      distribuer: ['Relais de chauffe', 'Triac de puissance'],
      convertir: ['Résistance chauffante', 'Effet Joule des résistances'],
      transmettre: ['Mécanisme ressort/levier', 'Glissière porte-pain']
    }
  },
  pompe_eau: {
    title: ['Pompe de Relevage', 'Pompe d’Eau Automatique'],
    instruction: ['Associez chaque composant de la pompe à sa fonction.'],
    items: {
      acquerir: ['Capteur de niveau', 'Flotteur de détection'],
      traiter: ['Automate de pilotage', 'Carte de commande'],
      communiquer: ['Ordre TOR vers contacteur', 'Bus de commande local'],
      alimenter: ['Réseau 230V', 'Arrivée énergie secteur'],
      distribuer: ['Contacteur de puissance', 'Relais de commande moteur'],
      convertir: ['Moteur électrique de pompe', 'Entraînement électromécanique'],
      transmettre: ['Arbre + turbine hydraulique', 'Roue de pompe']
    }
  },
  portail: {
    title: ['Portail Motorisé', 'Portail Automatique'],
    instruction: ['Classez les composants du portail dans la chaîne d’information et d’énergie.'],
    items: {
      acquerir: ['Cellules photoélectriques', 'Fin de course'],
      traiter: ['Carte de contrôle portail', 'Automate de commande'],
      communiquer: ['Liaison radio télécommande', 'Bus interne de commande'],
      alimenter: ['Alimentation secteur 230V', 'Bloc 24V de commande'],
      distribuer: ['Carte de puissance', 'Relais inverseur'],
      convertir: ['Motoréducteur', 'Moteur électrique portail'],
      transmettre: ['Crémaillère et pignon', 'Bras d’entraînement']
    }
  },
  ventilateur: {
    title: ['Ventilateur Intelligent', 'Aérateur Piloté'],
    instruction: ['Positionnez les composants du ventilateur dans la chaîne fonctionnelle.'],
    items: {
      acquerir: ['Sonde de température', 'Capteur d’humidité'],
      traiter: ['Microcontrôleur', 'Carte de régulation'],
      communiquer: ['Commande PWM', 'Liaison filaire de commande'],
      alimenter: ['Prise secteur', 'Bloc d’alimentation'],
      distribuer: ['Transistor de puissance', 'Relais de commande'],
      convertir: ['Moteur DC', 'Moteur brushless'],
      transmettre: ['Hélice', 'Hélice + axe']
    }
  },
  unknown: {
    title: ['Système Technique', 'Système Automatisé'],
    instruction: ['Associez les composants proposés aux 7 fonctions de la chaîne.'],
    items: {
      acquerir: ['Capteur principal du système', 'Capteur de mesure du système'],
      traiter: ['Unité de commande du système', 'Microcontrôleur du système'],
      communiquer: ['Liaison de commande du système', 'Bus de communication du système'],
      alimenter: ['Alimentation du système', 'Source d’énergie du système'],
      distribuer: ['Distribution de puissance du système', 'Organe de commutation du système'],
      convertir: ['Actionneur principal du système', 'Convertisseur d’énergie du système'],
      transmettre: ['Transmission mécanique du système', 'Organe final du système']
    }
  }
};

function buildLocalScenario(prompt) {
  const domain = inferDomain(prompt);
  const library = SCENARIO_LIBRARY[domain] || SCENARIO_LIBRARY.unknown;
  const systemLabel = toReadableSystemLabel(prompt);
  const isUnknownDomain = domain === 'unknown';

  const titleCore = pickOne(library.title);
  const title = prompt.length > 2
    ? `${titleCore} — ${prompt.trim().slice(0, 45)}`
    : titleCore;

  const instruction = isUnknownDomain
    ? `Associez les composants du ${systemLabel} aux 7 fonctions de la chaîne d'information et d'énergie.`
    : pickOne(library.instruction);

  const itemSource = isUnknownDomain
    ? buildPromptDrivenItems(prompt)
    : library.items;

  const items = REQUIRED_BLOCKS.map((targetBlock, index) => ({
    id: `gen_${Date.now()}_${index}`,
    name: domain === 'drone' && targetBlock === 'acquerir'
      ? 'Capteur de position (GNSS/GPS)'
      : pickOne(itemSource[targetBlock]),
    targetBlock
  }));

  return { title, instruction, items };
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    return writeJson(res, 204, {});
  }

  if (req.url !== '/api/generate-scenario' || req.method !== 'POST') {
    return writeJson(res, 404, { error: 'Route introuvable.' });
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1_000_000) {
      req.destroy();
    }
  });

  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body || '{}');
      const prompt = typeof parsedBody?.prompt === 'string' ? parsedBody.prompt.trim() : '';
      if (!prompt) {
        return writeJson(res, 400, { error: 'Le champ "prompt" est requis.' });
      }

      const scenario = buildLocalScenario(prompt);
      return writeJson(res, 200, { ...scenario, provider: 'copilot-local-generator' });
    } catch (error) {
      return writeJson(res, 500, { error: error instanceof Error ? error.message : 'Erreur inconnue.' });
    }
  });
});

server.listen(PORT, () => {
  console.log(`[ai-proxy] Générateur Copilot local en écoute sur http://localhost:${PORT}`);
});
