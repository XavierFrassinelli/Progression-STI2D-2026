---

## Application : Le Frein à Disque (Couple de Freinage)

Pour arrêter le véhicule, nous devons créer un **Couple de Freinage** ($C_f$) qui s'oppose à la rotation de la roue. Cette simulation illustre l'exercice de la page 4.

**Paramètres clés :**

* Force de Serrage ($F_N$) :

- L'effort hydraulique des pistons sur les plaquettes.

- Coefficient ($\mu$) : Dépend de la qualité des plaquettes (cf. TD : $\mu=0.8$).

- **Rayon ($r$) :** La distance entre l'axe de la roue et l'étrier.

<iframe 
    src="../../assets/frein.html" 
    width="100%" 
    height="650px" 
    frameborder="0"
    style="border: 1px solid #eee; border-radius: 8px;"
></iframe>

### Analyse Mécanique
Le freinage est une transformation d'effort :

1.  On serre le disque : **$F_N$** (Force Normale).

2.  Le frottement crée une force tangentielle : **$F_f = \mu \cdot F_N$** (multiplié par 2 car il y a 2 plaquettes !).
3.  Cette force crée un couple (moment) par rapport au centre : **$C_f = F_f \cdot r$**.

> **Note :** On voit clairement ici que pour augmenter le freinage, on peut soit appuyer plus fort ($F_N$), soit augmenter la taille du disque ($r$).