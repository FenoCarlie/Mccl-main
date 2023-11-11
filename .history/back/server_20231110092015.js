const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const multer = require("multer");
const XLSX = require("xlsx");

const upload = multer({ dest: "tmp/" });

// Create a connection to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mccl_gestion",
});

app.get("/get_client", (req, res) => {
  const sql = "select * from client";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});
app.get("/conteneur", (req, res) => {
  const sql = "select * from conteneur";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});
app.get("/conteneur/:conteneurId", (req, res) => {
  const { conteneurId } = req.params;

  const query = "SELECT * FROM conteneur WHERE id = ?";

  db.query(query, [conteneurId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred, please try again" });
    } else {
      res.json(result);
    }
  });
});

app.get("/projet/:clientId", (req, res) => {
  const { clientId } = req.params;

  // Requête SQL pour obtenir toutes les données de la table projet liées au client
  const projetQuery = "SELECT * FROM projet WHERE client_projet = ?";

  db.query(projetQuery, [clientId], (err, projetResult) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred, please try again" });
    } else {
      // Requête SQL pour obtenir toutes les données de la table conteneur_projet liées aux projets du client
      const conteneurQuery =
        "SELECT * FROM conteneur_projet WHERE projet_id IN (?)";
      const projetIds = projetResult.map((projet) => projet.id);

      db.query(conteneurQuery, [projetIds], (err, conteneurResult) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ error: "An error occurred, please try again" });
        } else {
          // Créez un tableau pour stocker les statistiques par projet
          const statsParProjet = [];

          projetResult.forEach((projet) => {
            // Filtrez les conteneurs liés à ce projet
            const conteneursDuProjet = conteneurResult.filter(
              (conteneur) => conteneur.projet_id === projet.id
            );

            // Comptez le nombre total de conteneurs pour ce projet
            const totalConteneurs = conteneursDuProjet.length;
            // Comptez le nombre de conteneurs actifs (false) pour ce projet
            const conteneursActifs = conteneursDuProjet.filter(
              (conteneur) => conteneur.status === 0
            ).length;
            // Comptez le nombre de conteneurs terminés (true) pour ce projet
            const conteneursTermines = conteneursDuProjet.filter(
              (conteneur) => conteneur.status === 1
            ).length;

            // Stockez les statistiques dans le tableau statsParProjet
            statsParProjet.push({
              id: projet.id,
              nom_projet: projet.nom_projet,
              date_creation: projet.date_creation,
              client_projet: projet.client_projet,
              num_booking: projet.num_booking,
              status: projet.status,
              totalConteneurs,
              conteneursActifs,
              conteneursTermines,
            });
          });

          res.json(statsParProjet);
        }
      });
    }
  });
});

app.get("/client/:clientId", (req, res) => {
  const { clientId } = req.params;

  const query = "SELECT * FROM client WHERE id = ?";

  db.query(query, [clientId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred, please try again" });
    } else {
      res.json(result);
    }
  });
});
app.get("/stockage/getIn/:TpId", (req, res) => {
  const { TpId } = req.params;

  const getStockageQuery = `
  SELECT stockage.*, mouvement.projet_id AS mouvement_projet_id, mouvement.conteneur_id AS mouvement_conteneur_id, projet.nom_projet AS projet_nom_projet, projet.client_projet AS projet_client_projet, client.nom AS client_nom, client.adresse AS client_adresse, client.email AS client_email, client.contacte AS client_contacte, conteneur.num_conteneur AS conteneur_num_conteneur, conteneur.line AS conteneur_line, conteneur.tare AS conteneur_tare, conteneur.type AS conteneur_type, terre_plain.code_location AS terre_plain_code_location, terre_plain.localisation AS terre_plain_localisation, terre_plain.nom AS terre_plain_nom
    FROM stockage
    INNER JOIN mouvement ON stockage.mouvement_id = mouvement.id
    INNER JOIN projet ON mouvement.projet_id = projet.id
    LEFT JOIN client ON projet.client_projet = client.id
    INNER JOIN conteneur ON mouvement.conteneur_id = conteneur.id
    INNER JOIN terre_plain ON stockage.tp_id = terre_plain.id
    WHERE stockage.tp_id = ? AND stockage.date_debut IS NULL
`;

  db.query(getStockageQuery, [TpId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error:
          "Une erreur s'est produite lors de la récupération des données de stockage, veuillez réessayer",
      });
    }
    res.json(result);
  });
});
app.get("/stockage/TpPlain/:TpId", (req, res) => {
  const { TpId } = req.params;

  const getStockageQuery = `
    SELECT 
      stockage.*,
      mouvement.projet_id AS mouvement_projet_id,
      mouvement.conteneur_id AS mouvement_conteneur_id,
      projet.nom_projet AS projet_nom_projet,
      projet.client_projet AS projet_client_projet,
      client.nom AS client_nom,
      client.adresse AS client_adresse,
      client.email AS client_email,
      client.contacte AS client_contacte,
      conteneur.num_conteneur AS conteneur_num_conteneur,
      conteneur.line AS conteneur_line,
      conteneur.tare AS conteneur_tare,
      conteneur.type AS conteneur_type,
      terre_plain.code_location AS terre_plain_code_location,
      terre_plain.localisation AS terre_plain_localisation,
      terre_plain.nom AS terre_plain_nom,
      conteneur_projet.status AS conteneur_projet_status,
      conteneur_projet.date_ajoute AS conteneur_projet_date_ajoute,
      conteneur_projet.etat AS conteneur_projet_etat
    FROM stockage    
    INNER JOIN mouvement ON stockage.mouvement_id = mouvement.id
    INNER JOIN projet ON mouvement.projet_id = projet.id
    LEFT JOIN client ON projet.client_projet = client.id
    INNER JOIN conteneur ON mouvement.conteneur_id = conteneur.id
    INNER JOIN terre_plain ON stockage.tp_id = terre_plain.id
    INNER JOIN conteneur_projet ON conteneur.id = conteneur_projet.conteneur_id AND projet.id = conteneur_projet.projet_id
    WHERE stockage.tp_id = ? AND stockage.date_debut IS NOT NULL AND conteneur_projet.etat = 'Plain'
  `;

  db.query(getStockageQuery, [TpId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error:
          "Une erreur s'est produite lors de la récupération des données de stockage, veuillez réessayer",
      });
    }

    const response = {
      stockage: result,
      total_conteneurs: result.length,
    };

    res.json(response);
  });
});

app.get("/stockage/TpVide/:TpId", (req, res) => {
  const { TpId } = req.params;

  const getStockageQuery = `
  SELECT 
    stockage.*,
    mouvement.projet_id AS mouvement_projet_id,
    mouvement.conteneur_id AS mouvement_conteneur_id,
    projet.nom_projet AS projet_nom_projet,
    projet.client_projet AS projet_client_projet,
    client.nom AS client_nom,
    client.adresse AS client_adresse,
    client.email AS client_email,
    client.contacte AS client_contacte,
    conteneur.num_conteneur AS conteneur_num_conteneur,
    conteneur.line AS conteneur_line,
    conteneur.tare AS conteneur_tare,
    conteneur.type AS conteneur_type,
    terre_plain.code_location AS terre_plain_code_location,
    terre_plain.localisation AS terre_plain_localisation,
    terre_plain.nom AS terre_plain_nom,
    conteneur_projet.status AS conteneur_projet_status,
    conteneur_projet.date_ajoute AS conteneur_projet_date_ajoute,
    conteneur_projet.etat AS conteneur_projet_etat
  FROM stockage    
  INNER JOIN mouvement ON stockage.mouvement_id = mouvement.id
  INNER JOIN projet ON mouvement.projet_id = projet.id
  LEFT JOIN client ON projet.client_projet = client.id
  INNER JOIN conteneur ON mouvement.conteneur_id = conteneur.id
  INNER JOIN terre_plain ON stockage.tp_id = terre_plain.id
  INNER JOIN conteneur_projet ON conteneur.id = conteneur_projet.conteneur_id AND projet.id = conteneur_projet.projet_id
  WHERE stockage.tp_id = ? AND stockage.date_debut IS NOT NULL AND conteneur_projet.etat = 'Vide'
`;

  db.query(getStockageQuery, [TpId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error:
          "Une erreur s'est produite lors de la récupération des données de stockage, veuillez réessayer",
      });
    }

    const response = {
      stockage: result,
      total_conteneurs: result.length,
    };

    res.json(response);
  });
});

app.get("/stockage/getOut/:TpId", (req, res) => {
  const { TpId } = req.params;

  const getStockageQuery = `
    SELECT stockage.*, mouvement.projet_id AS mouvement_projet_id, mouvement.conteneur_id AS mouvement_conteneur_id, projet.nom_projet AS projet_nom_projet, projet.client_projet AS projet_client_projet, client.nom AS client_nom, client.adresse AS client_adresse, client.email AS client_email, client.contacte AS client_contacte, conteneur.num_conteneur AS conteneur_num_conteneur, conteneur.line AS conteneur_line, conteneur.tare AS conteneur_tare, conteneur.type AS conteneur_type, terre_plain.code_location AS terre_plain_code_location, terre_plain.localisation AS terre_plain_localisation, terre_plain.nom AS terre_plain_nom
    FROM stockage
    INNER JOIN mouvement ON stockage.mouvement_id = mouvement.id
    INNER JOIN projet ON mouvement.projet_id = projet.id
    LEFT JOIN client ON projet.client_projet = client.id
    INNER JOIN conteneur ON mouvement.conteneur_id = conteneur.id
    INNER JOIN terre_plain ON stockage.tp_id = terre_plain.id
    WHERE stockage.tp_id = ? AND stockage.date_fin IS NULL AND stockage.date_debut IS NOT NULL 
  `;

  db.query(getStockageQuery, [TpId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error:
          "Une erreur s'est produite lors de la récupération des données de stockage, veuillez réessayer",
      });
    }
    res.json(result);
  });
});

app.get("/projet/infoConteneur/:conteneurId/:projetId", (req, res) => {
  const { conteneurId, projetId } = req.params;

  const query = `
  SELECT cp.conteneur_id , cp.projet_id , cp.status AS status_conteneur, cp.date_ajoute,
          c.num_conteneur, c.line, c.type, c.tare, p.nom_projet, p.date_creation, p.client_projet, p.num_booking, p.status AS status_projet,
    tp.type AS type_projet
    FROM conteneur_projet cp
    JOIN conteneur c ON cp.conteneur_id = c.id
    JOIN projet p ON cp.projet_id = p.id
    JOIN type_projet tp ON p.id = tp.projet_id
    WHERE cp.conteneur_id = ? AND cp.projet_id = ?
  `;

  db.query(query, [conteneurId, projetId], (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Une erreur s'est produite, veuillez réessayer." });
    } else {
      if (result.length === 0) {
        res
          .status(404)
          .json({ error: "Les données spécifiées n'ont pas été trouvées." });
      } else {
        res.json(result); // Vous pouvez renvoyer tous les résultats ici
      }
    }
  });
});

app.get("/projet/infoProjet/:projetId", (req, res) => {
  const { projetId } = req.params;

  const query = `SELECT projet.status, projet.id, projet.nom_projet, projet.client_projet, projet.num_booking,
  client.nom, client.adresse, client.email, client.contacte,
  type_projet.type
FROM projet
LEFT JOIN type_projet ON type_projet.projet_id = projet.id
INNER JOIN client ON projet.client_projet = client.id
WHERE projet.id = ?`;

  db.query(query, [projetId], (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Une erreur s'est produite, veuillez réessayer." });
    } else {
      if (result.length === 0) {
        res
          .status(404)
          .json({ error: "Le projet spécifié n'a pas été trouvé." });
      } else {
        res.json(result);
      }
    }
  });
});
app.get("/projet/infoConteneur/:projetId", (req, res) => {
  const { projetId } = req.params;

  const query = `SELECT cp.status, c.id, c.num_conteneur, c.line, c.type
    FROM conteneur_projet cp
    INNER JOIN conteneur c ON cp.conteneur_id = c.id
    WHERE cp.projet_id = ?`;

  db.query(query, [projetId], (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Une erreur s'est produite, veuillez réessayer." });
    } else {
      if (result.length === 0) {
        res
          .status(404)
          .json({ error: "Le projet spécifié n'a pas été trouvé." });
      } else {
        res.json(result);
      }
    }
  });
});
app.get("/projet/historique/:conteneurId", (req, res) => {
  const { conteneurId } = req.params;

  const query =
    "SELECT  cp.conteneur_id, cp.status AS conteneur_status, cp.date_ajoute AS date_ajoute_conteneur, p.id AS projet_id, p.nom_projet, c.nom AS nom_client, p.date_creation AS date_creation_projet, p.num_booking, p.status AS projet_status FROM conteneur_projet cp INNER JOIN projet p ON cp.projet_id = p.id INNER JOIN client c ON p.client_projet = c.id WHERE cp.conteneur_id = ? ORDER BY date_creation_projet;";

  db.query(query, [conteneurId], (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Une erreur s'est produite, veuillez réessayer." });
    } else {
      if (result.length === 0) {
        res
          .status(404)
          .json({ error: "Le projet spécifié n'a pas été trouvé." });
      } else {
        res.json(result);
      }
    }
  });
});

app.get("/get/projet", (req, res) => {
  const sql =
    "SELECT projet.*, client.* FROM projet LEFT JOIN client ON projet.client_projet = client.id ORDER BY projet.date_creation DESC;";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});
app.get("/get/tp", (req, res) => {
  const sql = "SELECT * FROM terre_plain";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});

app.get("/get/projet/false", (req, res) => {
  const sql =
    "SELECT projet.*, client.id AS client_id, client.nom, client.adresse, client.contacte, client.email FROM projet LEFT JOIN client ON projet.client_projet = client.id WHERE status = false ORDER BY projet.date_creation DESC;";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});
app.get("/get/projet/all", (req, res) => {
  const sql =
    "SELECT projet.*, client.id AS client_id, client.nom, client.adresse, client.contacte, client.email FROM projet LEFT JOIN client ON projet.client_projet = client.id ORDER BY projet.date_creation DESC;";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});
app.post("/create/projet", (req, res) => {
  const {
    nom_projet,
    client_projet,
    num_booking,
    type: projet_type,
  } = req.body;

  const insertProjetSql = `
    INSERT INTO projet (
      nom_projet,
      client_projet,
      num_booking
    ) VALUES (?, ?, ?)
  `;

  const insertProjetValues = [nom_projet, client_projet, num_booking];

  db.query(insertProjetSql, insertProjetValues, (err, result) => {
    if (err) {
      console.error("Error inserting data: " + err.message);
      return res.status(500).json({ error: "Error inserting data" }); // Return an error response
    }

    const projet_id = result.insertId;

    const insertProjetTypeSql = `
      INSERT INTO type_projet (type, projet_id) VALUES (?, ?)
    `;

    const insertProjetTypeValues = [projet_type, projet_id];

    db.query(insertProjetTypeSql, insertProjetTypeValues, (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de l'insertion de l'association conteneur-projet : " +
            err.message
        );
        return res.status(500).json({
          error: "Erreur lors de l'insertion de l'association conteneur-projet",
        });
      }

      console.log("Association conteneur-projet insérée avec succès");
      return res
        .status(200)
        .json({ message: "Conteneur créé et associé au projet avec succès" });
    });
  });
});

app.post("/create/conteneur", (req, res) => {
  const { num_conteneur, line, tare, type, projet_id } = req.body;

  const insertConteneurSql = `
    INSERT INTO conteneur (num_conteneur, line, tare, type) VALUES (?, ?, ?, ?)
  `;

  const insertConteneurValues = [num_conteneur, line, tare, type];

  db.query(insertConteneurSql, insertConteneurValues, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du conteneur : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion du conteneur" });
    }

    console.log("Conteneur inséré avec succès");
    const conteneurId = result.insertId;

    const projetId = projet_id;

    const insertConteneurProjetSql = `
      INSERT INTO conteneur_projet (conteneur_id, projet_id) VALUES (?, ?)
    `;

    const insertConteneurProjetValues = [conteneurId, projetId];

    db.query(
      insertConteneurProjetSql,
      insertConteneurProjetValues,
      (err, result) => {
        if (err) {
          console.error(
            "Erreur lors de l'insertion de l'association conteneur-projet : " +
              err.message
          );
          return res.status(500).json({
            error:
              "Erreur lors de l'insertion de l'association conteneur-projet",
          });
        }

        console.log("Association conteneur-projet insérée avec succès");
        return res
          .status(200)
          .json({ message: "Conteneur créé et associé au projet avec succès" });
      }
    );
  });
});
app.post("/create/transport_terrestre/import", (req, res) => {
  const {
    num_camion,
    num_permis,
    nom_chauffeur,
    lieu_enlevement_plein,
    date_enlevement_plein,
    lieu_restitution,
    date_restitution,
    lieu_depotage,
    date_depotage,
    transport_id,
    date_depart,
    conteneur_id,
    projet_id,
    nom_projet,
    client_id,
  } = req.body;

  const insertMouvementSql = `
    INSERT INTO mouvement (conteneur_id, projet_id) VALUES (?, ?)
  `;

  const insertMouvementValues = [conteneur_id, projet_id];

  db.query(insertMouvementSql, insertMouvementValues, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du mouvement : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion du mouvement" });
    }

    console.log("mouvement inséré avec succès");
    const mouvementId = result.insertId;

    const insertTransportValues = [
      num_camion,
      num_permis,
      nom_chauffeur,
      transport_id,
      date_depart,
      mouvementId,
    ];

    console.log(insertTransportValues);

    const insertImportValues = [
      lieu_enlevement_plein,
      date_enlevement_plein,
      lieu_restitution,
      date_restitution,
      lieu_depotage,
      date_depotage,
      mouvementId,
    ];

    const insertTransportSql = `
      INSERT INTO transport_terrestre (num_camion, num_permis, nom_chauffeur, transport_id, date_depart, mouvement_id) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertImportSql = `
      INSERT INTO import (lieu_enlevement_plein, date_enlevement_plein, lieu_restitution, date_restitution, lieu_depotage, date_depotage, mouvement_id) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertTransportSql, insertTransportValues, (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion : " + err.message);
        return res.status(500).json({
          error: "Erreur lors de l'insertion",
        });
      }

      db.query(insertImportSql, insertImportValues, (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion : " + err.message);
          return res.status(500).json({
            error: "Erreur lors de l'insertion",
          });
        }

        // Check the condition
        if (lieu_restitution === "Italia") {
          const insertProjetValues = [nom_projet, client_id];
          const insertProjetSql = `
    INSERT INTO projet (nom_projet, client_projet) VALUES (?, ?)
  `;

          db.query(insertProjetSql, insertProjetValues, (err, result) => {
            if (err) {
              console.error(
                "Erreur lors de l'insertion du projet : " + err.message
              );
              return res.status(500).json({
                error: "Erreur lors de l'insertion du projet",
              });
            }

            const projetId = result.insertId;

            const insertMouvementProjetValues = [conteneur_id, projetId];
            const insertMouvementProjetSql = `
      INSERT INTO mouvement (conteneur_id, projet_id) VALUES (?, ?)
    `;

            db.query(
              insertMouvementProjetSql,
              insertMouvementProjetValues,
              (err, result) => {
                if (err) {
                  console.error(
                    "Erreur lors de l'insertion du mouvement : " + err.message
                  );
                  return res.status(500).json({
                    error: "Erreur lors de l'insertion du mouvement",
                  });
                }

                const mouvementProjetId = result.insertId;

                // Perform the search for "Italia" in the terre_plain table and get the tp_id
                const searchItaliaSql = `
        SELECT id FROM terre_plain WHERE nom = 'Italia'
      `;

                db.query(searchItaliaSql, (err, result) => {
                  if (err) {
                    console.error(
                      "Erreur lors de la recherche de 'Italia' : " + err.message
                    );
                    return res.status(500).json({
                      error: "Erreur lors de la recherche de 'Italia'",
                    });
                  }

                  const tpId = result[0].id;

                  const insertTerrePlainValues = [mouvementProjetId, tpId];
                  const insertTerrePlainSql = `
                  INSERT INTO stockage (mouvement_id, tp_id) VALUES (?, ?)
                `;

                  db.query(
                    insertTerrePlainSql,
                    insertTerrePlainValues,
                    (err, result) => {
                      if (err) {
                        console.error(
                          "Erreur lors de l'insertion dans terre_plain_mouvement : " +
                            err.message
                        );
                        return res.status(500).json({
                          error:
                            "Erreur lors de l'insertion dans terre_plain_mouvement",
                        });
                      }

                      console.log("Insertion réussie");
                      return res.status(200).json({
                        message: "Insertion réussie",
                      });
                    }
                  );
                });
              }
            );
          });
        } else {
          return res.status(200).json({
            message: "Conteneur créé et associé au projet avec succès",
          });
        }
      });
    });
  });
});

app.post("/create/transport_terrestre/transfert", (req, res) => {
  const {
    num_camion,
    num_permis,
    nom_chauffeur,
    lieu_enlevement_plein,
    date_enlevement_plein,
    lieu_restitution,
    date_restitution,
    lieu_depotage,
    date_depotage,
    transport_id,
    date_depart,
    conteneur_id,
    projet_id,
  } = req.body;

  const insertMouvementSql = `
    INSERT INTO mouvement (conteneur_id, projet_id) VALUES (?, ?)
  `;

  const insertMouvementValues = [conteneur_id, projet_id];

  db.query(insertMouvementSql, insertMouvementValues, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du mouvement : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion du mouvement" });
    }

    console.log("mouvement inséré avec succès");
    const mouvementId = result.insertId;

    const insertTransportValues = [
      num_camion,
      num_permis,
      nom_chauffeur,
      transport_id,
      date_depart,
      mouvementId,
    ];

    const insertTransfertValues = [
      lieu_enlevement_plein,
      date_enlevement_plein,
      lieu_restitution,
      date_restitution,
      lieu_depotage,
      date_depotage,
      mouvementId,
    ];

    const insertTransportSql = `
      INSERT INTO transport_terrestre (num_camion, num_permis, nom_chauffeur, transport_id, date_depart, mouvement_id) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertTransfertSql = `
      INSERT INTO transfert (lieu_enlevement_plein, date_enlevement_plein, lieu_restitution, date_restitution, lieu_depotage, date_depotage, mouvement_id) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertTransportSql, insertTransportValues, (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion : " + err.message);
        return res.status(500).json({
          error: "Erreur lors de l'insertion",
        });
      }

      db.query(insertTransfertSql, insertTransfertValues, (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion : " + err.message);
          return res.status(500).json({
            error: "Erreur lors de l'insertion",
          });
        }

        return res
          .status(200)
          .json({ message: "Conteneur créé et associé au projet avec succès" });
      });
    });
  });
});

app.post("/create/transport_terrestre/export", (req, res) => {
  const {
    num_camion,
    num_permis,
    nom_chauffeur,
    lieu_enlevement_vide,
    date_enlevement_vide,
    date_empotage,
    lieu_empotage,
    lieu_livraison,
    date_livraison,
    transport_id,
    date_depart,
    conteneur_id,
    projet_id,
  } = req.body;

  const insertMouvementSql = `
    INSERT INTO mouvement (conteneur_id, projet_id) VALUES (?, ?)
  `;

  const insertMouvementValues = [conteneur_id, projet_id];

  db.query(insertMouvementSql, insertMouvementValues, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du mouvement : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion du mouvement" });
    }

    console.log("mouvement inséré avec succès");
    const mouvementId = result.insertId;

    const insertTransportValues = [
      num_camion,
      num_permis,
      nom_chauffeur,
      transport_id,
      date_depart,
      mouvementId,
    ];

    const insertExportValues = [
      lieu_enlevement_vide,
      date_enlevement_vide,
      date_empotage,
      lieu_empotage,
      lieu_livraison,
      date_livraison,
      mouvementId,
    ];

    const insertTransportSql = `
      INSERT INTO transport_terrestre (num_camion, num_permis, nom_chauffeur, transport_id, date_depart, mouvement_id) VALUES (?, ?, ?, ?, ?, ?)
      `;
    const insertExportSql = `
        INSERT INTO export (lieu_enlevement_vide, date_enlevement_vide, date_empotage, lieu_empotage, lieu_livraison, date_livraison, mouvement_id) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

    db.query(insertTransportSql, insertTransportValues, (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion : " + err.message);
        return res.status(500).json({
          error: "Erreur lors de l'insertion",
        });
      }

      db.query(insertExportSql, insertExportValues, (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion : " + err.message);
          return res.status(500).json({
            error: "Erreur lors de l'insertion",
          });
        }

        return res
          .status(200)
          .json({ message: "Conteneur créé et associé au projet avec succès" });
      });
    });
  });
});

app.post("/create/transport_rail/import", (req, res) => {
  const {
    num_wagno,
    num_plateforme,
    lieu_enlevement_plein,
    date_enlevement_plein,
    lieu_restitution,
    date_restitution,
    lieu_depotage,
    date_depotage,
    transport_id,
    date_depart,
    conteneur_id,
    projet_id,
  } = req.body;

  const insertMouvementSql = `
    INSERT INTO mouvement (conteneur_id, projet_id) VALUES (?, ?)
  `;

  const insertMouvementValues = [conteneur_id, projet_id];

  db.query(insertMouvementSql, insertMouvementValues, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du mouvement : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion du mouvement" });
    }

    console.log("mouvement inséré avec succès");
    const mouvementId = result.insertId;

    const insertTransportValues = [
      num_wagno,
      num_plateforme,
      transport_id,
      date_depart,
      mouvementId,
    ];

    const insertTransportSql = `
      INSERT INTO transport_rail (num_wagno, num_plateforme, transport_id, date_depart, mouvement_id) VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertTransportSql, insertTransportValues, (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion : " + err.message);
        return res.status(500).json({
          error: "Erreur lors de l'insertion",
        });
      }

      const insertImportValues = [
        lieu_enlevement_plein,
        date_enlevement_plein,
        lieu_restitution,
        date_restitution,
        lieu_depotage,
        date_depotage,
        mouvementId,
      ];

      const insertImportSql = `
      INSERT INTO import (lieu_enlevement_plein, date_enlevement_plein, lieu_restitution, date_restitution, lieu_depotage, date_depotage, mouvement_id) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertImportSql, insertImportValues, (err, result) => {
        if (err) {
          console.error(
            "Erreur lors de l'insertion de l'import : " + err.message
          );
          return res.status(500).json({
            error: "Erreur lors de l'insertion de l'import",
          });
        }

        return res
          .status(200)
          .json({ message: "Conteneur créé et associé au projet avec succès" });
      });
    });
  });
});

app.post("/create/transport_rail/transfert", (req, res) => {
  const {
    num_wagno,
    num_plateforme_depart,
    num_plateforme_arrivee,
    date_depart,
    date_arrivee,
    transport_id,
    conteneur_id,
    projet_id,
  } = req.body;

  const insertMouvementSql = `
    INSERT INTO mouvement (conteneur_id, projet_id) VALUES (?, ?)
  `;

  const insertMouvementValues = [conteneur_id, projet_id];

  db.query(insertMouvementSql, insertMouvementValues, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du mouvement : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion du mouvement" });
    }

    console.log("mouvement inséré avec succès");
    const mouvementId = result.insertId;

    const insertTransportValues = [
      num_wagno,
      num_plateforme_depart,
      num_plateforme_arrivee,
      date_depart,
      date_arrivee,
      transport_id,
      mouvementId,
    ];

    const insertTransportSql = `
      INSERT INTO transport_rail (num_wagno, num_plateforme_depart, num_plateforme_arrivee, date_depart, date_arrivee, transport_id, mouvement_id) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertTransportSql, insertTransportValues, (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion : " + err.message);
        return res.status(500).json({
          error: "Erreur lors de l'insertion",
        });
      }

      const insertTransfertValues = [
        lieu_enlevement_plein,
        date_enlevement_plein,
        lieu_restitution,
        date_restitution,
        lieu_depotage,
        date_depotage,
        mouvementId,
      ];

      const insertTransfertSql = `
      INSERT INTO transfert (lieu_enlevement_plein, date_enlevement_plein, lieu_restitution, date_restitution, lieu_depotage, date_depotage, mouvement_id) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertTransfertSql, insertTransfertValues, (err, result) => {
        if (err) {
          console.error(
            "Erreur lors de l'insertion du transfert : " + err.message
          );
          return res.status(500).json({
            error: "Erreur lors de l'insertion du transfert",
          });
        }

        return res
          .status(200)
          .json({ message: "Conteneur créé et associé au projet avec succès" });
      });
    });
  });
});

app.post("/create/stockage", (req, res) => {
  const { tp_id, conteneur_id, projet_id } = req.body;

  const insertMouvementSql = `
    INSERT INTO mouvement (conteneur_id, projet_id) VALUES (?, ?)
  `;

  const insertMouvementValues = [conteneur_id, projet_id];

  db.query(insertMouvementSql, insertMouvementValues, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du mouvement : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion du mouvement" });
    }

    console.log("mouvement inséré avec succès");
    const mouvementId = result.insertId;

    const insertStockageValues = [tp_id, mouvementId];

    console.log(insertStockageValues);
    const insertStockageSql = `
    INSERT INTO stockage (tp_id, mouvement_id) VALUES (?, ?)
    `;

    db.query(insertStockageSql, insertStockageValues, (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion : " + err.message);
        return res.status(500).json({
          error: "Erreur lors de l'insertion",
        });
      }
    });
  });
});
app.post("/create/transport_rail/export", (req, res) => {
  const {
    num_wagno,
    num_plateforme,
    date_depart,
    lieu_enlevement_vide,
    date_enlevement_vide,
    date_empotage,
    lieu_empotage,
    lieu_livraison,
    date_livraison,
    transport_id,
    conteneur_id,
    projet_id,
  } = req.body;

  const insertMouvementSql = `
    INSERT INTO mouvement (conteneur_id, projet_id) VALUES (?, ?)
  `;

  const insertMouvementValues = [conteneur_id, projet_id];

  db.query(insertMouvementSql, insertMouvementValues, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du mouvement : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion du mouvement" });
    }

    console.log("mouvement inséré avec succès");
    const mouvementId = result.insertId;

    const insertTransportValues = [
      num_wagno,
      num_plateforme,
      date_depart,
      transport_id,
      mouvementId,
    ];

    const insertTransportSql = `
    INSERT INTO transport_rail (num_wagno, num_plateforme, transport_id, date_depart, mouvement_id) VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertTransportSql, insertTransportValues, (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion : " + err.message);
        return res.status(500).json({
          error: "Erreur lors de l'insertion",
        });
      }

      const insertExportValues = [
        lieu_enlevement_vide,
        date_enlevement_vide,
        date_empotage,
        lieu_empotage,
        lieu_livraison,
        date_livraison,
        mouvementId,
      ];

      const insertExportSql = `
      INSERT INTO export (lieu_enlevement_vide, date_enlevement_vide, date_empotage, lieu_empotage, lieu_livraison, date_livraison, mouvement_id) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertExportSql, insertExportValues, (err, result) => {
        if (err) {
          console.error(
            "Erreur lors de l'insertion de l'export : " + err.message
          );
          return res.status(500).json({
            error: "Erreur lors de l'insertion de l'export",
          });
        }

        return res
          .status(200)
          .json({ message: "Conteneur créé et associé au projet avec succès" });
      });
    });
  });
});

app.post("/create/conteneur/file", upload.single("file"), (req, res) => {
  var workbook = XLSX.readFile(req.file.path);
  var worksheet = workbook.Sheets["conteneur"];

  var range = XLSX.utils.decode_range("D4:G300");

  let queries = [];

  for (var R = range.s.r; R <= range.e.r; ++R) {
    var row = [];
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var cell_address = { c: C, r: R };
      var cell = worksheet[XLSX.utils.encode_cell(cell_address)];
      row.push(cell ? cell.v : undefined);
    }

    // Use the row data
    const [num_conteneur, type, line, tare] = row;

    // Only insert the row if num_conteneur is not empty
    if (num_conteneur) {
      queries.push(
        new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO conteneur (num_conteneur, type, line, tare) VALUES (?, ?, ?, ?)",
            row,
            (error, results, fields) => {
              if (error) reject(error);
              else resolve();
            }
          );
        })
      );
    }
  }

  Promise.all(queries)
    .then(() => {
      res.send("File uploaded and database updated.");
    })
    .catch((error) => {
      throw error;
    });
});

app.put("/projet/:projetId", (req, res) => {
  const { projetId } = req.params;
  const updatedProjet = req.body;

  const updateQuery = "UPDATE projet SET ? WHERE id = ?";

  db.query(updateQuery, [updatedProjet, projetId], (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Une erreur s'est produite, veuillez réessayer." });
    } else {
      res.json({ message: "Projet mis à jour avec succès" });
    }
  });
});

app.get("/transport", (req, res) => {
  const sql = "SELECT * FROM transport;";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});

app.post("/create/client", (req, res) => {
  const { nom, adresse, contacte, email } = req.body;

  const sql = `
    INSERT INTO client (
      nom,
      adresse,
      contacte,
      email
    ) VALUES (?, ?, ?, ?)
  `;

  const values = [nom, adresse, contacte, email];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data: " + err.message);
      return res.status(500).json({ error: "Error inserting data" }); // Return an error response
    }
    console.log("Data inserted successfully");
    return res
      .status(200)
      .json({ message: "Data inserted successfully", data: result });
  });
});

app.post("/projet/ajoutProjet", (req, res) => {
  const { projetId, containerIds, etat } = req.body;

  // Assurez-vous que les données requises sont présentes
  if (!projetId || !containerIds || !Array.isArray(containerIds)) {
    return res.status(400).json({ error: "Données incorrectes" });
  }

  // Créez un tableau de valeurs pour chaque insertion
  const values = containerIds.map((containerId) => [
    projetId,
    containerId,
    etat,
  ]);

  // Insérez les conteneurs dans la base de données (table "projet_conteneur" par exemple)
  const sql = `
    INSERT INTO conteneur_projet (projet_id, conteneur_id, etat) VALUES ?
  `;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion des données" }); // Retourne une réponse d'erreur
    }
    console.log("Conteneurs ajoutés avec succès");
    return res
      .status(200)
      .json({ message: "Conteneurs ajoutés avec succès", data: result });
  });
});

app.post("/create/client", (req, res) => {
  const { nom, adresse, contacte, email } = req.body;

  const sql = `
    INSERT INTO client (
      nom,
      adresse,
      contacte,
      email
    ) VALUES (?, ?, ?, ?)
  `;

  const values = [nom, adresse, contacte, email];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data: " + err.message);
      return res.status(500).json({ error: "Error inserting data" }); // Return an error response
    }
    console.log("Data inserted successfully");
    return res
      .status(200)
      .json({ message: "Data inserted successfully", data: result });
  });
});

app.post("/create/conteneur/exel", (req, res) => {
  const { jsonData } = req.body;

  console.log("Données JSON reçues :", jsonData);

  if (!jsonData || !Array.isArray(jsonData)) {
    return res.status(400).json({ error: "Les données JSON sont requises" });
  }

  const sql = `
    INSERT INTO conteneur (num_conteneur, type, line, tare)
    VALUES ?
  `;

  const values = jsonData.map((data) => [
    data.num_conteneur,
    data.type,
    data.line,
    data.tare,
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données : " + err.message);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'insertion des données" });
    }
    console.log("Données insérées avec succès");
    return res
      .status(200)
      .json({ message: "Données insérées avec succès", data: result });
  });
});

app.put("/update/client/:clientId", (req, res) => {
  const clientId = req.params.clientId;
  const { nom, adresse, contacte, email } = req.body;

  const sql = `
    UPDATE client
    SET
      nom = ?,
      adresse = ?,
      contacte = ?,
      email = ?
    WHERE id = ?
  `;

  const values = [nom, adresse, contacte, email, clientId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating data: " + err.message);
      return res.status(500).json({ error: "Error updating data" }); // Return an error response
    }
    console.log("Data updated successfully");
    return res
      .status(200)
      .json({ message: "Data updated successfully", data: result });
  });
});

app.put("/stockage/GetIn/:containerId", (req, res) => {
  const containerId = req.params.containerId;
  const { position } = req.body;

  const sql = `
    UPDATE stockage
    SET position = ?
    WHERE id = ?
  `;

  const values = [position, containerId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating data: " + err.message);
      return res.status(500).json({ error: "Error updating data" });
    }
    console.log("Data updated successfully");
    return res
      .status(200)
      .json({ message: "Data updated successfully", data: result });
  });
});

// Login route
app.post("/login", (req, res) => {
  const { reg_number, password } = req.body;

  const sql = "SELECT * FROM user WHERE reg_number = ?";
  db.query(sql, [reg_number], (err, results) => {
    if (err) {
      console.error("Erreur lors de la recherche de l'utilisateur :", err);
      return res
        .status(500)
        .json({ error: "Erreur lors de la recherche de l'utilisateur" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const user = results[0];
    const reg_number = user.reg_number;

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Erreur lors de la comparaison des mots de passe :", err);
        return res
          .status(500)
          .json({ error: "Erreur lors de la comparaison des mots de passe" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }

      const token = jwt.sign(
        { reg_number: user.reg_number },
        "votre_secret_jwt",
        { expiresIn: "1h" }
      );

      console.log(token.reg_number);

      // Retournez les détails de l'utilisateur (user) avec le token dans un tableau
      res.json({ message: "Connexion réussie", data: { reg_number, token } });
      console.log(reg_number);
    });
  });
});

app.post("/logout", (req, res) => {
  const token = req.headers.authorization; // Le token JWT doit être envoyé dans les en-têtes

  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }
  res.json({ message: "Token révoqué avec succès" });
});

app.post("/signup", (req, res) => {
  const { reg_number, password, name, position } = req.body;

  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error("error generating salt:", err);
      return res.status(500).json({ error: "error generating salt" });
    }

    // hash the password with the generated salt
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error("error hashing password:", err);
        return res.status(500).json({ error: "error hashing password" });
      }

      // store the hashed password in the database
      const sql =
        "INSERT INTO user (reg_number, password, name, position) VALUES (?, ?, ?, ?)";
      db.query(sql, [reg_number, hash, name, position], (err) => {
        if (err) {
          console.error("error storing user:", err);
          return res.status(500).json({ error: "error storing user" });
        }

        // registration successful
        res.json({ message: "registration successful" });
      });
    });
  });
});

// Connect to the database
/*
app.get("/user/:reg_number", (req, res, next) => {
  const { reg_number } = req.user; // Assuming the logged-in user's registration number is stored in req.user

  const sql = "SELECT * FROM user WHERE reg_number = ?";
  db.query(sql, [reg_number], (err, data) => {
    if (err) {
      console.error("error retrieving data: " + err.message);
      next(err); // pass the error to the global error handling middleware
    } else {
      res.json(data);
    }
  });
});
db.connect((err) => {
  if (err) {
    console.error("Database connection error: " + err.message);
    return res.status(500).json({ error: "Database connection error" }); // Return an error response
  } else {
    console.log("Connected to the database");
  }
});

app.get("/user", (req, res, next) => {
  const { reg_number } = req.user; // Assuming the logged-in user's registration number is stored in req.user

  const sql = "SELECT * FROM user WHERE reg_number = ?";
  db.query(sql, [reg_number], (err, data) => {
    if (err) {
      console.error("error retrieving data: " + err.message);
      next(err); // pass the error to the global error handling middleware
    } else {
      res.json(data);
    }
  });
});



app.get("/", (req, res) => {
  const sql = "select * from container WHERE date_out = '0000-00-00';";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});
app.get("/container/preAdvice", (req, res) => {
  const sql = "select * from container WHERE date_in = '0000-00-00';";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});

app.get("/transport", (req, res) => {
  const sql = "SELECT * FROM transport;";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});

app.get("/container/in_progress", (req, res) => {
  const sql =
    "SELECT c.*, tp.location, transport.company FROM container c LEFT JOIN tp ON c.id_tp = tp.id_tp LEFT JOIN transport ON c.id_transport = transport.id_transport WHERE progress = true;";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});
app.get("/container/in_progress-last", (req, res) => {
  const sql =
    "SELECT c.* FROM container c WHERE (c.progress = TRUE) OR (c.progress = FALSE AND c.add_date = ( SELECT MAX(c2.add_date) FROM container c2 WHERE c2.num_container = c.num_container ));";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
    }
    return res.json(data);
  });
});

app.post("/create", (req, res) => {
  const {
    num_container,
    line,
    shipment,
    booking,
    type,
    category,
    status,
    tare,
    client,
  } = req.body;

  const sql = `
    INSERT INTO container (
      num_container,
    line,
    shipment,
    booking,
    type,
    category,
    status,
    tare,
    client
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const values = [
    num_container,
    line,
    shipment,
    booking,
    type,
    category,
    status,
    tare,
    client,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data: " + err.message);
      return res.status(500).json({ error: "Error inserting data" }); // Return an error response
    }
    console.log("Data inserted successfully");
    return res
      .status(200)
      .json({ message: "Data inserted successfully", data: result });
  });
});
app.post("/create/user", (req, res) => {
  const { password, reg_number, name, position } = req.body;

  const sql = `
    INSERT INTO container (
      password,
      reg_number,
      name,
      position
    ) VALUES (?, ?, ?)
`;

  const values = [password, reg_number, name, position];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data: " + err.message);
      return res.status(500).json({ error: "Error inserting data" }); // Return an error response
    }
    console.log("Data inserted successfully");
    return res
      .status(200)
      .json({ message: "Data inserted successfully", data: result });
  });
});

app.delete("/delete/:id_container", (req, res) => {
  const containerId = req.params.id_container;
  // Assuming you are using a database, you can use a query to delete the container with the specified ID
  db.query(
    "DELETE FROM container WHERE id_container = ?",
    [containerId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500); // Send an error status code back to the client
      } else {
        res.sendStatus(200); // Send a success status code back to the client
      }
    }
  );
});

app.get("/container/:id_container", (req, res) => {
  const containerId = req.params.id_container;

  const query = `
      SELECT 
        c.*,
        tp.location,
        transport.company
      FROM 
        container c
      LEFT JOIN 
        tp ON c.id_tp = tp.id_tp
      LEFT JOIN 
        transport ON c.id_transport = transport.id_transport
      WHERE 
        c.id_container = ?
    `;

  db.query(query, [containerId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while attempting to fetch the container",
      });
    } else {
      res.status(200).json(results);
    }
  });
});
app.get("/container/historic/:num_container", (req, res) => {
  const containerNum = req.params.num_container;

  const query = `
      SELECT c.*, tp.location, transport.company FROM container c LEFT JOIN tp ON c.id_tp = tp.id_tp LEFT JOIN transport ON c.id_transport = transport.id_transport WHERE c.num_container = ?
    `;

  db.query(query, [containerNum], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while attempting to fetch the container",
      });
    } else {
      res.status(200).json(results);
    }
  });
});*/

/* *********************** */

/*
app.get("/tp", (req, res) => {
  const sql = "SELECT * FROM tp";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json({ error: "Error retrieving data" });
    }
    return res.json(data);
  });
});

app.get("/clients/suggestions", (req, res) => {
  const searchTerm = req.query.searchTerm;
  const sql = "SELECT id_cli, name FROM client WHERE name LIKE ?";
  const searchTermWithWildcard = `%${searchTerm}%`;

  db.query(sql, [searchTermWithWildcard], (err, data) => {
    if (err) {
      console.error("Error retrieving client suggestions: " + err.message);
      return res
        .status(500)
        .json({ error: "Error retrieving client suggestions" });
    }
    return res.json(data);
  });
});*/

/* *********************** */
/*
app.put("/container/:id_container", (req, res) => {
  const containerId = req.params.id_container;
  const updatedContainer = req.body;

  db.query(
    "UPDATE container SET ? WHERE id_container = ?",
    [updatedContainer, containerId],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while attempting to update the container",
        });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Container not found" });
      } else {
        res.status(200).json({ message: "Container updated successfully" });
      }
    }
  );
});
app.put("/container/get_out/:id_container", (req, res) => {
  const containerId = req.params.id_container;
  const updatedDateOut = req.body.date_out;

  db.query(
    "UPDATE container SET date_out = ? WHERE id_container = ?",
    [updatedDateOut, containerId],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while attempting to update the date_out",
        });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Container not found" });
      } else {
        res.status(200).json({ message: "Date_out updated successfully" });
      }
    }
  );
});
app.put("/container/get_in/:id_container", (req, res) => {
  const containerId = req.params.id_container;
  const updatePosition = req.body.position;
  const updatedDatein = req.body.date_in;

  db.query(
    "UPDATE container SET date_in = ?, position = ? WHERE id_container = ?",
    [updatedDatein, updatePosition, containerId],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while attempting to update the date_out",
        });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Container not found" });
      } else {
        res.status(200).json({ message: "Date_out updated successfully" });
      }
    }
  );
});

app.get("/data", (req, res) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;

  const query = `
    SELECT 
      date_in, 
      date_out, 
      category
    FROM 
      container
    WHERE 
      (date_in BETWEEN ? AND ?) OR
      (date_out BETWEEN ? AND ?)
  `;

  db.query(
    query,
    [startDate, endDate, startDate, endDate],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while attempting to fetch the data",
        });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/api/import-export", (req, res) => {
  const { start_date, end_date } = req.query;

  const query = `
    SELECT category, date_in as date 
    FROM container 
    WHERE date_in >= ? AND date_in <= ?
    ORDER BY date ASC;
  `;

  db.query(query, [start_date, end_date], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête :", err);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des données" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/progress_false", (req, res) => {
  const query = "SELECT * FROM container WHERE progress = FALSE;";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête :", err);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des données" });
    } else {
      res.json(results);
    }
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json({ message: "Logout successful" });
  });
}); */

app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
