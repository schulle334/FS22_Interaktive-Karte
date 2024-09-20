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

1. **Klonen des Repositories:**
   ```
   git clone https://github.com/dein-username/dein-repo.git
   ```
2. **Projekt öffnen:**
   Öffne `index.html` in einem Webbrowser, um die interaktive Karte anzuzeigen.
3. **Interaktive Karte verwenden:**
   - Felder können auf der Karte gezeichnet und Informationen wie aktuelle Frucht und Aufgaben hinzugefügt werden.
   - Daten können importiert und exportiert werden, um den aktuellen Zustand zu speichern oder zu laden.
4. **Saatgut Rechner:**
   - Klicke auf den "Saat Rechner"-Button in der Sidebar, um den Saatgutbedarfsrechner zu öffnen.

## 🛠️ Funktionen

- **Interaktive Karte:** 
  - Zeichnen und Verwalten von Feldern.
  - Speicherung und Wiederherstellung des Zustands der Karte.
  - Fruchtfolgeempfehlungen basierend auf den Daten in `crop.json`.
  - Aufgabenverwaltung für Felder.

- **Saatgut Rechner:**
  - Berechnung des benötigten Saatguts basierend auf der Fläche und der gewählten Fruchtart.
  - Integration in die Karte über ein modales Fenster.

## 🚧 To-Do's und geplante Features
- **Erweiterte Kartenfunktionen:**
  - Unterstützung für mehrere Kartenlayer und detailliertere Bearbeitungsfunktionen.
- **Optimierung der UI:**
  - Bessere Darstellung und Anpassung für mobile Geräte.
- **Erweiterung der Saatgutberechnung:**
  - Berücksichtigung von Bodeneigenschaften und Wetterbedingungen.

## 💡 Ideen und Vorschläge

Gerne nehme ich Vorschläge und Ideen zur Verbesserung des Projekts an. Zögere nicht, ein Issue auf GitHub zu erstellen oder mich direkt zu kontaktieren.
