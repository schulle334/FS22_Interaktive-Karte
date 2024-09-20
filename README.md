Wiki Folgt für bessere übersicht!






# Landwirtschafts-Simulator Interaktive Karte und Saatgut Rechner

Dieses Projekt bietet eine interaktive Karte für den Landwirtschafts-Simulator 22, kombiniert mit einem Saatgutbedarfsrechner. Es ermöglicht die Verwaltung von Feldern, die Berechnung des Saatgutbedarfs sowie die Anzeige von empfohlenen Fruchtfolgen.

## 📂 Projektstruktur

- **index.html**  
  Enthält die Hauptseite mit der interaktiven Karte. Integriert Leaflet zur Kartendarstellung und eine Sidebar mit verschiedenen Optionen zur Verwaltung der Felder.

- **saat_calc.html**  
  Ein separater Rechner zur Berechnung des benötigten Saatguts basierend auf der Fläche und der Fruchtart.

- **saat_calc.js**  
  Skript für den Saatgutrechner. Enthält eine Liste von Fruchtarten und die Logik zur Berechnung des Saatgutbedarfs.

- **script.js**  
  Enthält die Hauptlogik für die interaktive Karte, inklusive Funktionen zur Feldverwaltung, Fruchtfolge-Empfehlungen und Datenexport/import.

- **crop.json**  
  JSON-Datei mit Informationen zu den verschiedenen Fruchtarten, inklusive Farbcodierung und empfohlenen Fruchtfolgen.

- **styles.css**  
  Stile für die Seiten, einschließlich Anpassungen für die Karte, Modale und allgemeine UI-Elemente.

## ⚙️ Installation und Nutzung

1. **Repository klonen:**
   ```
   git clone https://github.com/dein-username/dein-repo.git
   ```

2. **Starte einen lokalen Server:**

   Es gibt mehrere Möglichkeiten, einen lokalen Server zu starten, um das Projekt korrekt anzuzeigen:

   ### 1. Live Server in Visual Studio Code
   - **Installation:** Installiere die [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in Visual Studio Code.
   - **Verwendung:** Öffne das Projekt in VS Code und klicke unten rechts auf "Go Live", um den Server zu starten.

   ### 2. Python SimpleHTTPServer (Python 2) oder http.server (Python 3)
   - **Installation:** Python ist in der Regel vorinstalliert. Stelle sicher, dass du Python 3 oder höher verwendest.
   - **Verwendung:**
     1. Öffne ein Terminal und navigiere in das Verzeichnis deines Projekts.
     2. Starte den Server mit folgendem Befehl:
        ```
        python -m http.server
        ```
     3. Der Server läuft dann standardmäßig auf `http://localhost:8000`.

   ### 3. Node.js mit HTTP-Server
   - **Installation:** Installiere Node.js von [nodejs.org](https://nodejs.org/).
   - **Verwendung:**
     1. Installiere das Paket `http-server` global:
        ```
        npm install -g http-server
        ```
     2. Navigiere in das Verzeichnis deines Projekts und starte den Server:
        ```
        http-server
        ```
     3. Der Server läuft dann standardmäßig auf `http://localhost:8080`.

   ### 4. PHP Built-in Server
   - **Installation:** PHP muss installiert sein (kann von [php.net](https://www.php.net/) heruntergeladen werden).
   - **Verwendung:**
     1. Öffne ein Terminal und navigiere in das Verzeichnis deines Projekts.
     2. Starte den Server mit folgendem Befehl:
        ```
        php -S localhost:8000
        ```
     3. Der Server läuft dann auf `http://localhost:8000`.

   ### 5. BrowserSync
   - **Installation:** Erfordert Node.js. Installiere BrowserSync global:
     ```
     npm install -g browser-sync
     ```
   - **Verwendung:**
     1. Navigiere in das Verzeichnis deines Projekts und starte den Server:
        ```
        browser-sync start --server --files "*"
        ```
     2. Der Server öffnet die Seite automatisch in deinem Standardbrowser und aktualisiert die Seite bei Änderungen.

   ### 6. Brackets Live Preview
   - **Installation:** Installiere den [Brackets Editor](http://brackets.io/).
   - **Verwendung:** Öffne das Projekt in Brackets und klicke auf "Live Preview", um die Seite im Browser zu starten.

   ### 7. XAMPP oder MAMP (Für erweiterte Funktionen)
   - **Installation:** Installiere [XAMPP](https://www.apachefriends.org/index.html) oder [MAMP](https://www.mamp.info/).
   - **Verwendung:** Kopiere dein Projekt in das `htdocs`-Verzeichnis (bei XAMPP) oder in das `MAMP`-Verzeichnis. Starte Apache und greife über `http://localhost/dein-projekt-verzeichnis` auf dein Projekt zu.

3. **Projekt im Browser anzeigen:**
   Der Server öffnet das Projekt automatisch in deinem Standardbrowser. Falls nicht, kannst du `http://localhost:PORT/index.html` manuell in die Adressleiste eingeben. Ersetze `PORT` durch den verwendeten Port (z.B. `5500` für Live Server, `8000` für Python Server).

4. **Interaktive Karte verwenden:**
   - Felder können auf der Karte gezeichnet und Informationen wie aktuelle Frucht und Aufgaben hinzugefügt werden.
   - Daten können importiert und exportiert werden, um den aktuellen Zustand zu speichern oder zu laden.

5. **Saatgut Rechner:**
   - Klicke auf den "Saat Rechner"-Button in der Sidebar, um den Saatgutbedarfsrechner zu öffnen.

## 🛠️ Funktionen

- **Interaktive Karte:** 
  - Zeichnen und Verwalten von Feldern.
  - Speicherung und Wiederherstellung des Zustands der Karte.
  - Fruchtfolgeempfehlungen basierend auf den Daten in `crop.json`. (WIP)
  - Aufgabenverwaltung für Felder.

- **Saatgut Rechner:**
  - Berechnung des benötigten Saatguts basierend auf der Fläche und der gewählten Fruchtart. (WIP)
  - Integration in die Karte über ein modales Fenster.

## 🚧 To-Do's und geplante Features

- **Wiki:** 
  - Bessere Übersicht für die Installation und Nutzung.
- **Erweiterte Kartenfunktionen:**
  - Unterstützung für mehrere Kartenlayer und detailliertere Bearbeitungsfunktionen.
- **Optimierung der UI:**
  - Bessere Darstellung und Anpassung für mobile Geräte.
- **Erweiterung der Saatgutberechnung:**
  - Berücksichtigung von Bodeneigenschaften und Wetterbedingungen.

## 💡 Ideen und Vorschläge

Gerne nehme ich Vorschläge und Ideen zur Verbesserung des Projekts an. Zögere nicht, ein Issue auf GitHub zu erstellen oder mich direkt zu kontaktieren.
