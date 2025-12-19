import React from 'react';
import { createRoot } from 'react-dom/client';
import MechanicsApp from './MechanicsApp'; // Assurez-vous que le chemin est bon

// On cherche la div avec l'ID "mechanics-root" dans votre page
const container = document.getElementById('mechanics-root');

if (container) {
  const root = createRoot(container);
  root.render(<MechanicsApp />);
} else {
  // Optionnel : Log pour le débug si la div n'est pas trouvée
  console.log("L'élément #mechanics-root n'est pas présent sur cette page.");
}