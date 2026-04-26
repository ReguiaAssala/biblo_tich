USE bibliotheque_dz;

-- ═══════════════════════════
-- COMMENTAIRES
-- ═══════════════════════════
CREATE TABLE IF NOT EXISTS commentaires (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  document_id    INT NOT NULL,
  utilisateur_id INT NOT NULL,
  contenu        TEXT NOT NULL,
  signale        BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ═══════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  titre          VARCHAR(200) NOT NULL,
  contenu        TEXT,
  type           ENUM('info','success','warning','document') DEFAULT 'info',
  lu             BOOLEAN DEFAULT FALSE,
  lien           VARCHAR(500),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;
  --    call idexesss here for free 
CREATE INDEX idx_docs_approuve ON documents(approuve);
CREATE INDEX idx_docs_module ON documents(module_id);
CREATE INDEX idx_docs_type ON documents(type_document);
CREATE INDEX idx_docs_niveau ON documents(niveau);

CREATE INDEX idx_tele_doc ON telechargements(document_id);
CREATE INDEX idx_tele_date ON telechargements(created_at);

CREATE INDEX idx_fav_user ON favoris(utilisateur_id);

CREATE INDEX idx_notif_user ON notifications(utilisateur_id);