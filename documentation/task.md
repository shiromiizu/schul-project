# Login mit Schul-E-Mail

## Description 
- Als registrierter Nutzer (Schüler, Lehrer oder SMV-Mitglied)
möchte ich mich mit meiner Schul-E-Mail-Adresse und meinem Passwort anmelden können,
damit ich Zugriff auf die für meine Rolle vorgesehenen Funktionen der Anwendung erhalte.

## Acceptance Criteria
- Login erfolgt über E-Mail + Passwort

- Nur E-Mail-Adressen mit der hinterlegten Schul-Domain sind erlaubt

- Bei erfolgreichem Login:
    - wird die Session gespeichert
    - erfolgt eine Weiterleitung auf das rollenabhängige Dashboard

- Bei fehlerhaften Zugangsdaten:
    - wird eine verständliche Fehlermeldung angezeigt

- Nicht authentifizierte Nutzer haben keinen Zugriff auf geschützte Seiten
