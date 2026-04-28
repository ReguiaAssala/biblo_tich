
USE bibliotheque_dz;

INSERT INTO documents
(
  module_id,titre,description,auteur,universite,annee_academique,type_document,niveau,fichier_path,fichier_nom,taille_fichier,uploader_id,approuve,featured)
SELECT

  m.id,
  'Sample — Algorithmique 1 (Cours)',

  'وثيقة مثال (مولّدة تلقائياً) للتجربة.',

  NULL,

  NULL,
  '2024/2025',
  'cours',
  'L1',
  'uploads/docs/samples/sample-algorithmique-1-cours.pdf',
  'sample-algorithmique-1-cours.pdf',
  NULL,
  NULL,
  1,
  1
FROM modules m
JOIN specialites s ON s.id=m.specialite_id

WHERE s.slug='informatique' AND m.slug='algorithmique-1'
LIMIT 1;


INSERT INTO documents
(
  
  module_id,titre,description,auteur,universite,annee_academique,type_document,niveau,fichier_path,fichier_nom,taille_fichier,uploader_id,approuve,featured)
SELECT

  m.id,
  'Sample — Base de donnees 1 (TD)',

  'وثيقة مثال للتجربة.',

  NULL,
  NULL,
  '2024/2025',
  'td',
  'L2',
  'uploads/docs/samples/sample-base-donnees-1-td.pdf',

  'sample-base-donnees-1-td.pdf',
  NULL,
  NULL,
  1,
  0
FROM modules m

JOIN specialites s ON s.id=m.specialite_id

WHERE s.slug='informatique'
 AND m.slug='base-donnees-1'
LIMIT 1;


INSERT INTO documents
(
  module_id,titre,description,auteur,universite,annee_academique,type_document,niveau,fichier_path,fichier_nom,taille_fichier,uploader_id,approuve,featured)

SELECT


  m.id,
  ' —  Logiciel (Rapport)',

  'وثيقة مثال (تقرير) للتجربة.',

  NULL,
  NULL,
  '2024/2025',
  'rapport',
  'L3',
  'uploads/docs/samples/sample-genie-logiciel-rapport.pdf',
  'sample-genie-logiciel-rapport.pdf',
  NULL,

  NULL,
  
  1,
  0
FROM modules m
JOIN specialites s ON s.id=m.specialite_id
WHERE s.slug='informatique' AND m.slug='genie-logiciel'
LIMIT 1;
