USE bibliotheque_dz;


INSERT INTO specialites (nom, slug, description, icone, couleur)
SELECT

'Electrotechnique',
'electrotechnique',
'Machines Électriques, Réseaux...',
'fas fa-bolt',
'#d68910'


WHERE NOT EXISTS (

	  SELECT 1 FROM specialites WHERE slug='electrotechnique'
);

SET @spec_electro := (SELECT id FROM specialites WHERE slug='electrotechnique' LIMIT 1);

INSERT IGNORE INTO modules (specialite_id, nom, slug, niveau)

 VALUES
 
(@spec_electro, 'Circuits Électriques 1', 'circuits-electriques-1','L1'),
(@spec_electro, 'Électromagnétisme',     'electromagnetisme','L1'),
(@spec_electro, 'Machines Électriques 1','machines-electriques-1','L2'),
(@spec_electro, 'Électronique de Puissance','electronique-puissance','L2'),
(@spec_electro, 'Réseaux Électriques',      'reseaux-electriques', 'L3'),
(@spec_electro, 'Machines Électriques 2',  'machines-electriques-2', 'L3'),
(@spec_electro, 'Commande des Systèmes', 'commande-systemes', 'M1'),
(@spec_electro, 'Qualité d\'Énergie', 'qualite-energie',   'M1'),
(@spec_electro, 'Énergies Renouvelables', 'energies-renouvelables', 'M2'),
(@spec_electro, 'Protection des Réseaux', 'protection-reseaux',  'M2');
