
CREATE DATABASE IF NOT EXISTS bibliotheque_dz 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE bibliotheque_dz;

--         SPECIALITES alll here so you can changed

CREATE TABLE IF NOT EXISTS specialites (

  id   INT AUTO_INCREMENT PRIMARY KEY,
  nom  VARCHAR(100) NOT NULL,

  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,

  icone       VARCHAR(50),

  couleur     VARCHAR(7) DEFAULT '#1a3a6e',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--                                           UTILISATEURS





CREATE TABLE IF NOT EXISTS utilisateurs (
  id     
  INT AUTO_INCREMENT PRIMARY KEY,
  nom    
  VARCHAR(100) NOT NULL,
  prenom 
  VARCHAR(100) NOT NULL,
  email  
  VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe  VARCHAR(255) NOT NULL,
  role          ENUM('etudiant','admin','moderateur') 
  DEFAULT 'etudiant',
  universite    VARCHAR(200),

  wilaya        VARCHAR(100),

  specialite_id INT,

  annee_etude   VARCHAR(10),

  avatar        VARCHAR(255),

  actif         TINYINT(1) DEFAULT 1,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (specialite_id) REFERENCES specialites(id) 
  ON DELETE SET NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--  MODULES




CREATE TABLE IF NOT EXISTS modules (

  id  INT AUTO_INCREMENT PRIMARY KEY,
  specialite_id INT NOT NULL,

  nom   VARCHAR(200) NOT NULL,
  slug  VARCHAR(200) NOT NULL,
  description   TEXT,

  niveau    ENUM('L1','L2','L3','M1','M2','Doctorat') DEFAULT 'L1',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (specialite_id) REFERENCES specialites(id) ON DELETE CASCADE,

  UNIQUE KEY uk_module (specialite_id, slug)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--         DOCUMENTS





CREATE TABLE IF NOT EXISTS documents (

  id                
  
  INT AUTO_INCREMENT PRIMARY KEY,
  module_id         
  
  INT NOT NULL,
  titre             
  
  VARCHAR(300) NOT NULL,
  description       
  
  TEXT,
  auteur            
  
  VARCHAR(200),
  universite       
   VARCHAR(200),
  annee_academique 
   VARCHAR(20),
  type_document   ENUM('cours','td','tp','examen','correction','these','rapport','resume') NOT NULL,
  niveau          ENUM('L1','L2','L3','M1','M2','Doctorat') DEFAULT 'L1',
  fichier_path    VARCHAR(500) NOT NULL,
  fichier_nom     VARCHAR(300) NOT NULL,
  taille_fichier  BIGINT,
  nb_pages        INT,
  nb_telechargements INT DEFAULT 0,
  nb_vues     INT DEFAULT 0,
  note_moyenn DECIMAL(3,2) DEFAULT 0,
  nb_notes    INT DEFAULT 0,
  uploader_id INT,
  approuve    TINYINT(1) DEFAULT 0,
  featured    TINYINT(1) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id)   REFERENCES modules(id)      ON DELETE CASCADE,
  FOREIGN KEY (uploader_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. NOTES / RATINGS

CREATE TABLE IF NOT EXISTS notes_documents 
(
  id             
  INT AUTO_INCREMENT PRIMARY KEY,
  document_id  INT NOT NULL,
  utilisateur_id INT NOT NULL,
  note    INT CHECK (note BETWEEN 1 AND 5),
  commentaire  TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uk_note (document_id, utilisateur_id),

  FOREIGN KEY (document_id)    REFERENCES documents(id) 
     ON DELETE CASCADE,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 6. FAVORIS

CREATE TABLE IF NOT EXISTS favoris (

  id             INT AUTO_INCREMENT PRIMARY KEY,


  utilisateur_id INT NOT NULL,
  document_id    INT NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_favori (utilisateur_id, document_id),
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (document_id)    REFERENCES documents(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- . TELECHARGEMENTS



CREATE TABLE IF NOT EXISTS telechargements (


  id             INT AUTO_INCREMENT PRIMARY KEY,
  document_id    INT NOT NULL,
  utilisateur_id INT,

  ip_address     VARCHAR(45),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id)   
  
   REFERENCES documents(id)   
  
   ON DELETE CASCADE,
  FOREIGN KEY (utilisateur_id) 
  
  REFERENCES utilisateurs(id) 
  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- . ANNONCES  
CREATE TABLE IF NOT EXISTS annonces (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  titre      VARCHAR(300) NOT NULL,
  contenu    TEXT NOT NULL,
  type       ENUM('info','warning','success') DEFAULT 'info',
  actif      TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- COMMENTAIRES

CREATE TABLE IF NOT EXISTS commentaires (
  id             
  INT AUTO_INCREMENT PRIMARY KEY,
  document_id    
  INT NOT NULL,
  utilisateur_id 
  INT NOT NULL,
  contenu        
  TEXT NOT NULL,
  signale        
  TINYINT(1) DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id)    REFERENCES documents(id)    ON DELETE CASCADE,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
)
 ENGINE=InnoDB 
 DEFAULT CHARSET=utf8mb4;

-- . NOTIFICATIONS

CREATE TABLE IF NOT EXISTS notifications (

  id    INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  titre VARCHAR(200) NOT NULL,
  contenu   TEXT,
  type         
    ENUM('info','success','warning','document') DEFAULT 'info',
  lu             TINYINT(1) DEFAULT 0,
  lien           VARCHAR(500),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4;

-- INDEXES mybee tot 10
CREATE INDEX idx_docs_approuve  

ON documents(approuve);
CREATE INDEX idx_docs_module    

ON documents(module_id);
CREATE INDEX idx_docs_type      

ON documents(type_document);
CREATE INDEX idx_docs_niveau    

ON documents(niveau);
CREATE INDEX idx_docs_featured  

ON documents(featured);
CREATE INDEX idx_tele_doc       

ON telechargements(document_id);
CREATE INDEX idx_tele_date      

ON telechargements(created_at);
CREATE INDEX idx_fav_user       

ON favoris(utilisateur_id);
CREATE INDEX idx_notif_user     

ON notifications(utilisateur_id);
CREATE INDEX idx_users_email    

ON utilisateurs(email);


-- DONNÉES: SPECIALITES  

INSERT INTO specialites (nom, slug, description, icone, couleur) 
VALUES

('Médecine',               

'medecine',            '1ère à 6ème année, toutes les spécialités médicales',          'fas fa-heartbeat',       '#e74c3c'),
('Science et Technologie', 

'science-technologie', 'Physique, Chimie, Maths, Analyse numérique...',                'fas fa-atom',            '#3498db'),
('Biologie',               

'biologie',            'SNV, Biochimie, Microbiologie, Génétique...',                  'fas fa-dna',             '#27ae60'),
('Pharmacie',              

'pharmacie',           'Pharmacologie, Galénique, Infectiologie...',                   'fas fa-pills',           '#9b59b6'),
('Informatique',           

'informatique',        'IA, Réseaux, GL, BD, Programmation, Sécurité...',             'fas fa-laptop-code',     '#2980b9'),
('Sciences de la Matière', 

'sciences-matiere',    'Physique, Acoustique, Thermodynamique...',                    'fas fa-flask',           '#f39c12'),
('Chimie',                 

'chimie',              'Fondamentale, Analytique, Polymères...',                      'fas fa-vial',            '#1abc9c'),
('Physique',               

'physique',            'Théorique, Nucléaire, Nano, Rayonnements...',                 'fas fa-satellite',       '#e67e22'),
('Génie des Procédés',     

'genie-procedes',      'Pétrochimie, Alimentaire, Environnement...',                  'fas fa-industry',        '#95a5a6'),
('Génie Civil',            

'genie-civil',         'Structures, Travaux Publics, Géotechnique...',                'fas fa-hard-hat',        '#7f8c8d'),
('Génie Mécanique',        

'genie-mecanique',     'Aéronautique, Fabrication, Matériaux...',                    'fas fa-cogs',            '#34495e'),
('Hydraulique',            

'hydraulique',         'Gestion des eaux, Assainissement...',                        'fas fa-water',           '#2471a3'),
('Electronique',           

'electronique',        'Microélectronique, Systèmes embarqués, Robotique...',         'fas fa-microchip',       '#8e44ad'),
('Automatique',            

'automatique',         'Robotique, Systèmes automatisés, Automatisme...',             'fas fa-robot',           '#16a085'),
('Télécommunication',      

'telecommunication',   'Signaux, Réseaux, Radio, Internet, Multimédia...',            'fas fa-broadcast-tower', '#2e86c1'),
('Electrotechnique',       

'electrotechnique',    'Machines Électriques, Réseaux électriques...',               'fas fa-bolt',            '#d68910'),
('Sciences Économiques',   

'sciences-economiques','Macro, Micro économie, Econométrie, Commerce...',             'fas fa-chart-line',      '#148f77'),
('Sciences De Gestion',    

'sciences-gestion',    'Finance, Marketing, GRH, Management...',                     'fas fa-briefcase',       '#943126');

-- :  —  id=5, 36 modulesss 
INSERT INTO modules (specialite_id, nom, slug, niveau)
 VALUES
(5, 'Algorithmique 1',                

'algorithmique-1',       'L1'),
(5, 'Analyse 1',                      

'analyse-1',             'L1'),
(5, 'Algèbre 1',                      

'algebre-1',             'L1'),
(5, 'Programmation C',                

'programmation-c',       'L1'),
(5, 'Logique Mathématique',           

'logique-mathematique',  'L1'),
(5, 'Electronique Numérique',         

'electronique-numerique','L1'),
(5, 'Algorithmique 2',                

'algorithmique-2',       'L2'),
(5, 'Algorithmique et Structures',    

'algorithmique-structures','L2'),
(5, 'Programmation C++',              

'programmation-cpp',     'L2'),
(5, 'Programmation Java',             

'programmation-java',    'L2'),
(5, 'Base de données 1',              

'base-donnees-1',        'L2'),
(5, 'Réseaux Informatiques 1',        

'reseaux-1',             'L2'),
(5, 'Systèmes d''Exploitation 1',     

'systemes-exploitation-1','L2'),
(5, 'Probabilités et Statistiques',   

'probabilites-stats',    'L2'),
(5, 'Analyse numérique',              

'analyse-numerique',     'L2'),
(5, 'Architecture des Ordinateurs',   

'architecture-ordi',     'L2'),
(5, 'Génie Logiciel',                 

'genie-logiciel',        'L3'),
(5, 'Base de données 2',              

'base-donnees-2',        'L3'),
(5, 'Développement Web',              

'developpement-web',     'L3'),
(5, 'Réseaux Informatiques 2',        

'reseaux-2',             'L3'),
(5, 'Compilation',                    

'compilation',           'L3'),
(5, 'Théorie des Graphes',            

'theorie-graphes',       'L3'),
(5, 'Programmation Python',           

'programmation-python',  'L3'),
(5, 'Systèmes d''Exploitation 2',     

'systemes-exploitation-2','L3'),
(5, 'Analyse et Conception SI',       

'analyse-conception',    'L3'),
(5, 'Apprentissage Automatique',      

'apprentissage-auto',    'M1'),
(5, 'Intelligence Artificielle',      

'intelligence-artificielle','M1'),
(5, 'Sécurité Informatique',          

'securite-info',         'M1'),
(5, 'Développement Mobile',           

'developpement-mobile',  'M1'),
(5, 'Cryptographie',                  

'cryptographie',         'M1'),
(5, 'Algorithmique Avancée',          

'algorithmique-avancee', 'M2'),
(5, 'Apprentissage Profond',          

'apprentissage-profond', 'M2'),
(5, 'Vision par Ordinateur',          

'vision-ordinateur',     'M2'),
(5, 'Traitement du Signal',           

'traitement-signal',     'M2'),
(5, 'Cloud Computing',                

'cloud-computing',       'M2'),
(5, 'Sujets Doctorat Informatique',   

'sujets-doctorat',       'Doctorat');

-- :MODULES — MEDECINE (id=1)


INSERT INTO modules (specialite_id, nom, slug, niveau)

 VALUES
(1, 'Anatomie',            


'anatomie',          'L1'),

(1, 'Biochimie Médicale',  


'biochimie-med',     'L1'),
(1, 'Histologie',          


'histologie',        'L1'),
(1, 'Physiologie',         


'physiologie',       'L2'),
(1, 'Pharmacologie',       


'pharmacologie-med', 'L3'),
(1, 'Sémiologie',          


'semiologie',        'L3'),
(1, 'Cardiologie',         


'cardiologie',       'M1'),
(1, 'Neurologie',          


'neurologie',        'M1'),
(1, 'Pédiatrie',           


'pediatrie',         'M2'),
(1, 'Chirurgie Générale',  


'chirurgie',         'M2');

-- :   CIVIL id=10

INSERT INTO modules (specialite_id, nom, slug, niveau)

 VALUES
(10, 'Résistance des Matériaux',  'resistance-materiaux', 'L2'),
(10, 'Béton Armé',                'beton-arme',           'L3'),
(10, 'Mécanique des Sols',        'mecanique-sols',       'L3'),
(10, 'Hydraulique Appliquée',     'hydraulique-app',      'L3'),
(10, 'Structures Métalliques',    'structures-metal',     'M1'),
(10, 'Calcul des Structures',     'calcul-structures',    'M1'),
(10, 'Géotechnique',              'geotechnique',         'M2');

-- :  — ELECTROTECHNIQUE via slug

SET @spec_electro := (SELECT id FROM specialites WHERE slug='electrotechnique' LIMIT 1);

INSERT IGNORE INTO modules (specialite_id, nom, slug, niveau) VALUES
(@spec_electro, 'Circuits Électriques 1',       

 'circuits-electriques-1',   'L1'),
(@spec_electro, 'Électromagnétisme',            

'electromagnetisme',        'L1'),
(@spec_electro, 'Machines Électriques 1',       

'machines-electriques-1',   'L2'),
(@spec_electro, 'Électronique de Puissance',    

'electronique-puissance',   'L2'),
(@spec_electro, 'Réseaux Électriques',          

'reseaux-electriques',      'L3'),
(@spec_electro, 'Machines Électriques 2',       

'machines-electriques-2',   'L3'),
(@spec_electro, 'Commande des Systèmes',        

'commande-systemes',        'M1'),
(@spec_electro, 'Qualité d\'Énergie',           

'qualite-energie',          'M1'),
(@spec_electro, 'Énergies Renouvelables',       

'energies-renouvelables',   'M2'),
(@spec_electro, 'Protection des Réseaux',       

'protection-reseaux',       'M2');


SELECT ' databasess iss readyy' AS status;

SELECT COUNT(*) AS specialites_count FROM specialites;
SELECT COUNT(*) AS modules_count FROM modules;
