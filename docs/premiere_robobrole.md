---
password: Opeth25
---

# Page secrète
Si vous voyez ce texte, c'est que le mot de passe a fonctionné !


## Robobrole

Le travail en équipe, autour d'un projet commun, favorise l'entraide.  
Les élèves font appel à des connaissances travaillées plus tôt dans la progression.  
Ils complètent également leurs connaissances grâce à l'approche projet.  
Les enseignements sont articulés en réponse aux problématiques que le CDC soulève.

=== "Cahier des charges"

    * Comment structurer les informations pour cadrer un projet ?

    * **CO 2.1 :**  Identifier les éléments influents du développement d’un produit

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/CDC_2025.pdf" width="100%" height="400px"></iframe>

    <div style="display: flex; justify-content: center;">
    <img src="/Progression-STI2D-2025/assets/fichiers/robobrole/req_robobrole.png" alt="diagramme stem" style="width: 800px; height: 500px;"/>
    </div>




=== "Pilotage robot"

    * Comment s'assurer de piloter notre robot à distance ?

    * **CO3.2:** 'Identifier et caractériser l’agencement matériel et/ou logiciel d’un produit

    <div style="display: flex; justify-content: center;">
    <img src="/Progression-STI2D-2025/assets/fichiers/robobrole/app_inv_1.png" alt="diagramme stem" style="width: 400px; height: 250px;"/>
    </div>

    * Faire appel aux notions de programmation vues plus tôt dans l'année et s'appuyer sur les travaux pratiques proposés ici pour adapter une solution au robot.

=== "Gestion de projet"

    * Le travail en projet doit-il être organisé ?

    * **CO5.1 :** S’impliquer dans une démarche de projet menée en groupe

    <div style="display: flex; justify-content: center;">
    <img src="/Progression-STI2D-2025/assets/fichiers/robobrole/gestion.jpg" alt="diagramme stem" style="width: 400px; height: 300px;"/>
    </div>

    * Avant projet

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/1_avant_projet.pdf" width="100%" height="400px"></iframe>

    * Chaîne fonctionnelle

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/12-c-chaines fonctionnelles.pdf" width="100%" height="400px"></iframe>

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/fiche chaine fonctionnelle.pdf" width="100%" height="400px"></iframe>

    * Conception préliminaire

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/2_conception_preliminaire.pdf" width="100%" height="400px"></iframe>



=== "Système de frappe"

    * Comment réaliser un système pour frapper le palet ?

    * **CO3.4 :** Identifier et caractériser des solutions techniques.

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/fiche dessin technique.pdf" width="100%" height="400px"></iframe>

    * Rationaliser des choix

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/fiche rationalisation des choix.pdf" width="100%" height="400px"></iframe>

    * Modélisation du système de frappe

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/modélisation d'un Shoot.pdf" width="100%" height="400px"></iframe>

    * Exemple de systèmes de frappe

    * Il est important de faire preuve d'imagination pour adapter les propositions à vos besoins.

        * **Bielle manivelle**

            ![bielle manivelle](https://1.bp.blogspot.com/-wEKU14QB9BM/WVQl41WDlUI/AAAAAAAACP4/KvkeVsvQmec77JsKXsZAh18GmrAfNv-GgCKgBGAs/s1600/biela2.gif)

        * **Lame élastique**


        <div style="display: flex; justify-content: center; align-items: center; height: auto;">
            <video width="640" height="360" controls>
                <source src="/Progression-STI2D-2025/assets/fichiers/robobrole/lame_elastique.mp4" type="video/mp4">
                Votre navigateur ne supporte pas l'élément vidéo.
            </video>
        </div>

        * Modélisation lame élastique 

        <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/modélisation d'un système de frappe.pdf" width="100%" height="400px"></iframe>

        * **Moteur à courant continu** 

        <div style="display: flex; justify-content: center;">
        <img src="/Progression-STI2D-2025/assets/fichiers/robobrole/aube.png" alt="diagramme stem" style="width: 400px; height: 300px;"/>
        </div>

        * Enregistrer un DXF pour découpe laser

        <div style="display: flex; justify-content: center; align-items: center; height: auto;">
            <video width="640" height="360" controls>
                <source src="/Progression-STI2D-2025/assets/fichiers/robobrole/enregistrer_DXF/enregistrer_DXF.mp4" type="video/mp4">
                Votre navigateur ne supporte pas l'élément vidéo.
            </video>
        </div>


=== "Capteur ultrason"

    * Comment permettre à notre robot de s'arrêter ?
    * **CO3.4 :** Identifier et caractériser des solutions techniques.
    * Découverte du capteur ultrason

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/TP_Ultrason.pdf" width="100%" height="400px"></iframe>

    * Exemple de lignes de code

    ```cpp
    #include "Ultrasonic.h"

    Ultrasonic ultrasonic(7);

    void setup() {
      Serial.begin(9600);
    }

    void loop() {
      long RangeInCentimeters;

      Serial.println("La distance de l'obstacle est : ");
      RangeInCentimeters = ultrasonic.MeasureInCentimeters();
      Serial.print(RangeInCentimeters); // 0~400cm
      Serial.println(" cm");
      delay(250);
    }
    ```

=== "Moteur à courant continu"

    * Comment gérer la vitesse de notre robot ?
    * **CO3.4 :** Identifier et caractériser des solutions techniques.
    * Notion de PWM (Pulse Width Modulation) Modulation de largeur d'impulsion

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/moteurs à courant continu.pdf" width="100%" height="400px"></iframe>

    * Exemple de lignes de code

    ```cpp
    void setup() {
       pinMode(12, OUTPUT);
    }

    void loop() {
       digitalWrite(12, HIGH); // allume le moteur
       delay(1000);
       digitalWrite(12, LOW); // désactiver le moteur
       delay(1000);
    }
    ```

=== "Servomoteur"

    * Comment piloter un servomoteur ?
    * **CO3.4 :** Identifier et caractériser des solutions techniques.
    * Explications du servomoteur

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/servo-moteur.pdf" width="100%" height="400px"></iframe>

    * Exemple de lignes de code

    ```cpp
    #include <Servo.h>  // on inclut la bibliothèque pour piloter un servomoteur

    Servo monServo;     // on crée l'objet monServo

    void setup() {
        monServo.attach(9);   // on définit le Pin utilisé par le servomoteur
        pinMode(13, OUTPUT);   // la Pin13 est mise en mode OUTPUT
    }

    void loop() {
        monServo.write(0);      // on dit à l'objet de mettre le servo à 0°
        monServo.write(180);    // on dit à l'objet de mettre le servo à 180°
    }
    ```

=== "Cinématique"

    * Introduction à la cinématique

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/Cours-cinematique_e.pdf" width="100%" height="400px"></iframe>


=== "Frottement"

    Comment évaluer les efforts qui agissent sur notre palet ?

    * **CO 7.5** Mettre en œuvre un scénario de validation devant intégrer un protocole d’essais, de mesures et/ou d’observations sur le prototype ou la maquette, interpréter les résultats et qualifier le produit.

    * Situation déclenchante

        <div style="display: flex; justify-content: center; align-items: center; height: auto;">
            <video width="640" height="360" controls>
                <source src="/Progression-STI2D-2025/assets/fichiers/robobrole/Tp première équilibre.mp4" type="video/mp4">
                Votre navigateur ne supporte pas l'élément vidéo.
            </video>
        </div>

    * Introduction au frottement (TP)

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/TP-frottement_e.pdf" width="100%" height="400px"></iframe>

    <div style="display: flex; justify-content: center; align-items: center; height: auto;">
        <video width="640" height="360" controls>
            <source src="/Progression-STI2D-2025/assets/fichiers/robobrole/Tp_frottements_2025.mp4" type="video/mp4">
            Votre navigateur ne supporte pas l'élément vidéo.
        </video>
    </div>

    * Synthèse tp

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/Synthèse tp frottement_e.pdf" width="100%" height="400px"></iframe>

    * Notion de frottement

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/Cours-frottement_e.pdf" width="100%" height="400px"></iframe>

    * Exercices : frottement

    <iframe src="/Progression-STI2D-2025/assets/fichiers/robobrole/TD-frottement_e.pdf" width="100%" height="400px"></iframe>
