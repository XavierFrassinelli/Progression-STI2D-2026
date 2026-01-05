# Étude du frottement : Le Convoyeur

Voici une simulation interactive pour comprendre l'influence de l'angle sur l'adhérence.

<iframe 
    src="../../assets/convoyeur.html" 
    width="100%" 
    height="600px" 
    frameborder="0"
    style="border: 1px solid #eee; border-radius: 8px;"
></iframe>

## Analyse
Comme vu dans le TD, lorsque l'angle α augmente :

1. La composante tangentielle du poids (qui tire vers le bas) augmente.
2. La composante normale (qui plaque l'objet) diminue.

Le décrochage se produit lorsque la tangente sort du cône de frottement défini par le coefficient μ.

## **Attention « Le piège de la masse »**

Avez-vous remarqué ? Si vous changez la masse, la boîte ne se met pas à glisser davantage.
    
**Pourquoi ?**
Si on double la masse, le Poids double.

- La force qui tire vers le bas ($F_T$) double.
- MAIS la force qui plaque au sol ($F_N$) double aussi, ce qui double l'adhérence disponible.
    
Les deux effets s'annulent. L'angle de glissement limite
ne dépend **que** des matériaux ($\mu$), pas de la masse.

---
