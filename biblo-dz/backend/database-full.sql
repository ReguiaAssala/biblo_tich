
-- ============================================
-- BIBLIOTHEQUE UNIVERSITAIRE ALGERIENNE
-- ============================================
DROP DATABASE IF EXISTS bibliotheque_dz;
CREATE DATABASE IF NOT EXISTS bibliotheque_dz 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE bibliotheque_dz;

-- ============================================
-- TABLE: SPECIALITES (18 majors)
-- ============================================
CREATE TABLE IF NOT EXISTS specialites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icone VARCHAR(50),
  couleur VARCHAR(7) DEFAULT '#1a3a6e',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- TABLE: MODULES (Units per speciality)
-- ============================================
CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  specialite_id INT NOT NULL,
  nom VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  niveau ENUM('L1','L2','L3','M1','M2','Doctorat') DEFAULT 'L1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (specialite_id) REFERENCES specialites(id) ON DELETE CASCADE,
  UNIQUE KEY uk_module (specialite_id, slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: UTILISATEURS (Users)
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  email VARCHAR(200) UNIQUE,
  telephone VARCHAR(20),
  avatar VARCHAR(500),
  role ENUM('etudiant','enseignant','admin') DEFAULT 'etudiant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: DOCUMENTS (PDF files)
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  titre VARCHAR(300) NOT NULL,
  description TEXT,
  auteur VARCHAR(200),
  universite VARCHAR(200),
  annee_academique VARCHAR(20),
  type_document ENUM('cours','td','tp','examen','correction','these','rapport','resume') NOT NULL,
  niveau ENUM('L1','L2','L3','M1','M2','Doctorat') DEFAULT 'L1',
  fichier_path VARCHAR(500) NOT NULL,
  fichier_nom VARCHAR(300) NOT NULL,
  taille_fichier BIGINT,
  nb_pages INT,
  nb_telechargements INT DEFAULT 0,
  nb_vues INT DEFAULT 0,
  note_moyenne DECIMAL(3,2) DEFAULT 0,
  nb_notes INT DEFAULT 0,
  uploader_id INT,
  approuve TINYINT(1) DEFAULT 0,
  featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (uploader_id) REFERENCES utilisateurs(id) ON DELETE SET NULL,
  CHECK (fichier_path <> '')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: ANNONCES (Announcements)
-- ============================================
CREATE TABLE IF NOT EXISTS annonces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(300) NOT NULL,
  contenu TEXT NOT NULL,
  type ENUM('info','warning','success') DEFAULT 'info',
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_docs_approuve ON documents(approuve);
CREATE INDEX idx_docs_module ON documents(module_id);
CREATE INDEX idx_docs_type ON documents(type_document);
CREATE INDEX idx_docs_niveau ON documents(niveau);
CREATE INDEX idx_docs_featured ON documents(featured);


-- ============================================
-- SEED DATA: SPECIALITES (18)
-- ============================================
INSERT IGNORE INTO specialites (nom, slug, description, icone, couleur) VALUES
('Médecine', 'medecine', '1ère à 6ème année, toutes les spécialités médicales', 'fas fa-heartbeat', '#e74c3c'),
('Science et Technologie', 'science-technologie', 'Physique, Chimie, Maths, Analyse numérique', 'fas fa-atom', '#3498db'),
('Biologie', 'biologie', 'SNV, Biochimie, Microbiologie, Génétique', 'fas fa-dna', '#27ae60'),
('Pharmacie', 'pharmacie', 'Pharmacologie, Galénique, Infectiologie', 'fas fa-pills', '#9b59b6'),
('Informatique', 'informatique', 'IA, Réseaux, GL, BD, Programmation, Sécurité', 'fas fa-laptop-code', '#2980b9'),
('Sciences de la Matière', 'sciences-matiere', 'Physique, Acoustique, Thermodynamique', 'fas fa-flask', '#f39c12'),
('Chimie', 'chimie', 'Fondamentale, Analytique, Polymères', 'fas fa-vial', '#1abc9c'),
('Physique', 'physique', 'Théorique, Nucléaire, Nano, Rayonnements', 'fas fa-satellite', '#e67e22'),
('Génie des Procédés', 'genie-procedes', 'Pétrochimie, Alimentaire, Environnement', 'fas fa-industry', '#95a5a6'),
('Génie Civil', 'genie-civil', 'Structures, Travaux Publics, Géotechnique', 'fas fa-hard-hat', '#7f8c8d'),
('Génie Mécanique', 'genie-mecanique', 'Aéronautique, Fabrication, Matériaux', 'fas fa-cogs', '#34495e'),
('Hydraulique', 'hydraulique', 'Gestion des eaux, Assainissement', 'fas fa-water', '#2471a3'),
('Électronique', 'electronique', 'Microélectronique, Systèmes embarqués, Robotique', 'fas fa-microchip', '#8e44ad'),
('Automatique', 'automatique', 'Robotique, Systèmes automatisés, Automatisme', 'fas fa-robot', '#16a085'),
('Télécommunication', 'telecommunication', 'Signaux, Réseaux, Radio, Internet, Multimédia', 'fas fa-broadcast-tower', '#2e86c1'),
('Électrotechnique', 'electrotechnique', 'Machines Électriques, Réseaux électriques', 'fas fa-bolt', '#d68910'),
('Sciences Économiques', 'sciences-economiques', 'Macro, Micro économie, Econométrie, Commerce', 'fas fa-chart-line', '#148f77'),
('Sciences De Gestion', 'sciences-gestion', 'Finance, Marketing, GRH, Management', 'fas fa-briefcase', '#943126');

-- ============================================
-- SEED DATA: MODULES (Unités) - ALL SPECIALTIES
-- ============================================

-- INFORMATIQUE (5)
INSERT IGNORE INTO modules (specialite_id, nom, slug, niveau) VALUES
(5, 'Algorithmique 1', 'algorithmique-1', 'L1'),
(5, 'Analyse 1', 'analyse-1', 'L1'),
(5, 'Algèbre 1', 'algebre-1', 'L1'),
(5, 'Programmation C', 'programmation-c', 'L1'),
(5, 'Logique Mathématique', 'logique-mathematique', 'L1'),
(5, 'Électronique Numérique', 'electronique-numerique', 'L1'),
(5, 'Algorithmique 2', 'algorithmique-2', 'L2'),
(5, 'Algorithmique et Structures', 'algorithmique-structures', 'L2'),
(5, 'Programmation C++', 'programmation-cpp', 'L2'),
(5, 'Programmation Java', 'programmation-java', 'L2'),
(5, 'Base de données 1', 'base-donnees-1', 'L2'),
(5, 'Réseaux Informatiques 1', 'reseaux-1', 'L2'),
(5, 'Systèmes d\'Exploitation 1', 'systemes-exploitation-1', 'L2'),
(5, 'Probabilités et Statistiques', 'probabilites-stats', 'L2'),
(5, 'Analyse numérique', 'analyse-numerique', 'L2'),
(5, 'Architecture des Ordinateurs', 'architecture-ordi', 'L2'),
(5, 'Génie Logiciel', 'genie-logiciel', 'L3'),
(5, 'Base de données 2', 'base-donnees-2', 'L3'),
(5, 'Développement Web', 'developpement-web', 'L3'),
(5, 'Réseaux Informatiques 2', 'reseaux-2', 'L3'),
(5, 'Compilation', 'compilation', 'L3'),
(5, 'Théorie des Graphes', 'theorie-graphes', 'L3'),
(5, 'Programmation Python', 'programmation-python', 'L3'),
(5, 'Systèmes d\'Exploitation 2', 'systemes-exploitation-2', 'L3'),
(5, 'Apprentissage Automatique', 'apprentissage-auto', 'M1'),
(5, 'Intelligence Artificielle', 'intelligence-artificielle', 'M1'),
(5, 'Sécurité Informatique', 'securite-info', 'M1'),
(5, 'Développement Mobile', 'developpement-mobile', 'M1'),
(5, 'Cryptographie', 'cryptographie', 'M1'),
(5, 'Algorithmique Avancée', 'algorithmique-avancee', 'M2'),
(5, 'Apprentissage Profond', 'apprentissage-profond', 'M2'),
(5, 'Vision par Ordinateur', 'vision-ordinateur', 'M2'),
(5, 'Traitement du Signal', 'traitement-signal', 'M2'),
(5, 'Cloud Computing', 'cloud-computing', 'M2'),

-- MEDECINE (1)
(1, 'Anatomie 1', 'anatomie-1', 'L1'),
(1, 'Biochimie 1', 'biochimie-1', 'L1'),
(1, 'Embryologie', 'embryologie', 'L1'),
(1, 'Histologie', 'histologie', 'L1'),
(1, 'Physiologie 1', 'physiologie-1', 'L2'),
(1, 'Pathologie Générale', 'pathologie-generale', 'L2'),
(1, 'Microbiologie', 'microbiologie', 'L2'),
(1, 'Pharmacologie', 'pharmacologie', 'L2'),
(1, 'Immunologie', 'immunologie', 'L3'),
(1, 'Sémiologie', 'semiologie', 'L3'),
(1, 'Cardiologie', 'cardiologie', 'M1'),
(1, 'Neurologie', 'neurologie', 'M1'),

-- SCIENCE ET TECHNOLOGIE (2)
(2, 'Mathématiques 1', 'mathematiques-1', 'L1'),
(2, 'Physique 1', 'physique-1', 'L1'),
(2, 'Chimie 1', 'chimie-1', 'L1'),
(2, 'Biologie Générale', 'biologie-generale', 'L1'),
(2, 'Mathématiques 2', 'mathematiques-2', 'L2'),
(2, 'Physique 2', 'physique-2', 'L2'),
(2, 'Chimie 2', 'chimie-2', 'L2'),
(2, 'Géologie', 'geologie', 'L2'),

-- BIOLOGIE (3)
(3, 'Biologie Cellulaire', 'biologie-cellulaire', 'L1'),
(3, 'Génétique 1', 'genetique-1', 'L1'),
(3, 'Écologie', 'ecologie', 'L1'),
(3, 'Microbiologie Générale', 'microbiologie-generale', 'L1'),
(3, 'Biochimie Métabolique', 'biochimie-metabolique', 'L2'),
(3, 'Biologie Moléculaire', 'biologie-moleculaire', 'L2'),
(3, 'Botanique', 'botanique', 'L2'),
(3, 'Zoologie', 'zoologie', 'L2'),

-- PHARMACIE (4)
(4, 'Pharmacologie 1', 'pharmacologie-1', 'L1'),
(4, 'Botanique Pharmaceutique', 'botanique-pharmaceutique', 'L1'),
(4, 'Chimie Pharmaceutique 1', 'chimie-pharmaceutique-1', 'L2'),
(4, 'Galénique', 'galenique', 'L2'),
(4, 'Pharmacodynamie', 'pharmacodynamie', 'L2'),
(4, 'Pharmacocinétique', 'pharmacocinetique', 'L3'),
(4, 'Toxicologie', 'toxicologie', 'L3'),

-- SCIENCES DE LA MATIERE (6)
(6, 'Physique Générale 1', 'physique-generale-1', 'L1'),
(6, 'Chimie Générale 1', 'chimie-generale-1', 'L1'),
(6, 'Mathématiques Appliquées', 'mathematiques-appliquees', 'L1'),
(6, 'Mécanique 1', 'mecanique-1', 'L2'),
(6, 'Thermodynamique 1', 'thermodynamique-1', 'L2'),
(6, 'Ondes et Vibrations', 'ondes-vibrations', 'L2'),

-- CHIMIE (7)
(7, 'Chimie Organique 1', 'chimie-organique-1', 'L1'),
(7, 'Chimie Inorganique 1', 'chimie-inorganique-1', 'L1'),
(7, 'Chimie Analytique 1', 'chimie-analytique-1', 'L2'),
(7, 'Chimie Analytique 2', 'chimie-analytique-2', 'L2'),
(7, 'Chimie Organique 2', 'chimie-organique-2', 'L2'),
(7, 'Chimie Organique 3', 'chimie-organique-3', 'L3'),

-- PHYSIQUE (8)
(8, 'Mécanique Classique', 'mecanique-classique', 'L1'),
(8, 'Thermodynamique', 'thermodynamique', 'L1'),
(8, 'Optique', 'optique', 'L2'),
(8, 'Électromagnétisme', 'electromagnetisme', 'L2'),
(8, 'Mécanique Quantique', 'mecanique-quantique', 'L3'),
(8, 'Relativité', 'relativite', 'L3'),

-- GENIE DES PROCEDES (9)
(9, 'Thermodynamique Chimique', 'thermodynamique-chimique', 'L1'),
(9, 'Génie Chimique Fondamentaux', 'genie-chimique-fondamentaux', 'L2'),
(9, 'Opérations Unitaires', 'operations-unitaires', 'L2'),
(9, 'Technologie Alimentaire', 'technologie-alimentaire', 'L3'),
(9, 'Traitement des Eaux', 'traitement-eaux', 'L3'),

-- GENIE CIVIL (10)
(10, 'Mécanique des Structures 1', 'mecanique-structures-1', 'L1'),
(10, 'Topographie', 'topographie', 'L1'),
(10, 'Résistance des Matériaux', 'resistance-materiaux', 'L2'),
(10, 'Béton Armé 1', 'beton-arme-1', 'L2'),
(10, 'Géotechnique', 'geotechnique', 'L3'),
(10, 'Routes et Ouvrages d\'Art', 'routes-ouvrages', 'L3'),

-- GENIE MECANIQUE (11)
(11, 'Mécanique Appliquée', 'mecanique-appliquee', 'L1'),
(11, 'Dessin Technique', 'dessin-technique', 'L1'),
(11, 'Éléments de Machines', 'elements-machines', 'L2'),
(11, 'Fabrication Mécanique', 'fabrication-mecanique', 'L2'),
(11, 'Aérodynamique', 'aerodynamique', 'L3'),
(11, 'Propulsion', 'propulsion', 'L3'),

-- HYDRAULIQUE (12)
(12, 'Mécanique des Fluides', 'mecanique-fluides', 'L1'),
(12, 'Hydrologie', 'hydrologie', 'L2'),
(12, 'Hydraulique des Canaux', 'hydraulique-canaux', 'L2'),
(12, 'Traitement et Distribution d\'Eau', 'traitement-distribution-eau', 'L3'),
(12, 'Assainissement', 'assainissement', 'L3'),

-- ELECTRONIQUE (13)
(13, 'Électronique Analogique 1', 'electronique-analogique-1', 'L1'),
(13, 'Électronique Numérique 1', 'electronique-numerique-1', 'L1'),
(13, 'Électronique Analogique 2', 'electronique-analogique-2', 'L2'),
(13, 'Microcontrôleurs', 'microcontroleurs', 'L2'),
(13, 'Circuits Intégrés', 'circuits-integres', 'L3'),
(13, 'Systèmes Embarqués', 'systemes-embarques', 'L3'),

-- AUTOMATIQUE (14)
(14, 'Automatisme 1', 'automatisme-1', 'L1'),
(14, 'Logique Programmée', 'logique-programmee', 'L1'),
(14, 'Asservissements Linéaires', 'asservissements-lineaires', 'L2'),
(14, 'Automates Programmables', 'automates-programmables', 'L2'),
(14, 'Robotique', 'robotique', 'L3'),
(14, 'Systèmes Temps Réel', 'systemes-temps-reel', 'L3'),

-- TELECOMMUNICATION (15)
(15, 'Théorie du Signal', 'theorie-signal', 'L1'),
(15, 'Transmission Numérique', 'transmission-numerique', 'L2'),
(15, 'Modulation et Codage', 'modulation-codage', 'L2'),
(15, 'Réseaux de Télécommunications', 'reseaux-telecom', 'L3'),
(15, 'Antennes et Propagation', 'antennes-propagation', 'L3'),

-- ELECTROTECHNIQUE (16)
(16, 'Machines Électriques 1', 'machines-electriques-1', 'L1'),
(16, 'Électrodynamique', 'electrodynamique', 'L1'),
(16, 'Convertisseurs Statiques', 'convertisseurs-statiques', 'L2'),
(16, 'Électrotechnique Industrielle', 'electrotechnique-industrielle', 'L2'),
(16, 'Distribution Électrique', 'distribution-electrique', 'L3'),
(16, 'Qualité de l\'Énergie', 'qualite-energie', 'L3'),

-- SCIENCES ECONOMIQUES (17)
(17, 'Microéconomie 1', 'microeconomie-1', 'L1'),
(17, 'Macroéconomie 1', 'macroeconomie-1', 'L1'),
(17, 'Statistiques Économiques', 'statistiques-economiques', 'L1'),
(17, 'Économétrie', 'econometrie', 'L2'),
(17, 'Droit Commercial', 'droit-commercial', 'L2'),
(17, 'Fiscalité', 'fiscalite', 'L3'),

-- SCIENCES DE GESTION (18)
(18, 'Comptabilité Générale', 'comptabilite-generale', 'L1'),
(18, 'Gestion Financière', 'gestion-financiere', 'L1'),
(18, 'Marketing Fondamental', 'marketing-fondamental', 'L2'),
(18, 'Gestion des Ressources Humaines', 'gestion-rh', 'L2'),
(18, 'Stratégie Entreprise', 'strategie-entreprise', 'L3'),
(18, 'Entrepreneuriat', 'entrepreneuriat', 'L3');

-- ============================================
-- SEED DATA: ANNOUNCEMENTS
-- ============================================
INSERT IGNORE INTO annonces (titre, contenu, type, actif) VALUES
('Bienvenue', 'Bienvenue sur la Bibliothèque Universitaire Algérienne. Accédez à des milliers de documents académiques.', 'success', 1),
('Actualisé', 'De nouveaux documents ont été ajoutés. Consultez les derniers cours et examens.', 'info', 1);

