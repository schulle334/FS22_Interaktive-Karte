// Initialisierung der Karte
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 5,
    maxBounds: [[0, 0], [4049, 4049]],
    maxBoundsViscosity: 1.0
}).setView([1024, 1024], -1);

// Bild-Overlays und Layer-Kontrolle
const imageBounds = [[0, 0], [4049, 4049]];
const imageUrls = ['./pda/pda_1.png', './pda/pda_2.png'];
const baseLayers = imageUrls.map(url => L.imageOverlay(url, imageBounds, { interactive: true, noWrap: true }));
const baseMaps = {
    "PDA 1": baseLayers[0].addTo(map),
    "PDA 2": baseLayers[1]
};
L.control.layers(baseMaps).addTo(map);

// Maßstabs- und Zoomkontrollen
L.control.scale({ imperial: false }).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

// Zeichenfunktionen initialisieren
const drawnItems = new L.FeatureGroup().addTo(map);
const drawControl = new L.Control.Draw({
    edit: { featureGroup: drawnItems },
    draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        polyline: false,
        marker: false,
        circlemarker: false
    }
}).addTo(map);

// Variablen initialisieren
let fields = [], cropRotation = {}, labelMarkers = new Map();

// Saatdaten laden
fetch('./src/crop.json')
    .then(response => response.json())
    .then(data => {
        cropRotation = data;
        console.log("Saat- und erweiterte Farbdaten erfolgreich geladen:", cropRotation);
        loadState();
    })
    .catch(error => console.error("Fehler beim Laden der Saat-Daten:", error));

// Hilfsfunktionen
const generateCropOptions = (selectedCrop = "") => {
    return `<option value="">Wähle Saat</option>` + Object.keys(cropRotation).map(crop => `
        <option value="${crop}" ${crop === selectedCrop ? 'selected' : ''}>${cropRotation[crop].name}</option>
    `).join('');
};

const updateFieldLabel = (fieldId, layer) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    if (labelMarkers.has(fieldId)) map.removeLayer(labelMarkers.get(fieldId));
    const center = layer.getBounds().getCenter();
    const labelIcon = L.divIcon({
        className: 'field-label',
        html: `<div>${field.number || fieldId}</div>`
    });
    const labelMarker = L.marker(center, { icon: labelIcon, interactive: false }).addTo(map);
    labelMarkers.set(fieldId, labelMarker);
};

const updatePopupContent = (fieldId, cropInfo, layer) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    const rotationsText = cropInfo.recommendedRotations?.join(', ') || 'Keine Empfehlungen';
    const taskList = field.tasks.map((task, index) => `
        <li class="d-flex justify-content-between align-items-center">
            <span>${task.text}</span>
            <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
            <button class="btn btn-danger btn-sm ml-2" onclick="deleteTask(${fieldId}, ${index})">Löschen</button>
        </li>`).join('');
    const popupContent = `
        <div class="p-2">
            <label for="fieldNumber-${fieldId}">Feldnummer:</label>
            <input type="text" id="fieldNumber-${fieldId}" class="form-control mb-2" value="${field.number}" placeholder="Feldnummer eingeben">
            <label for="manualArea-${fieldId}">Hektar (manuell):</label>
            <input type="number" id="manualArea-${fieldId}" class="form-control mb-2" value="${field.manualArea}" placeholder="Hektar eingeben">
            <label for="currentCrop-${fieldId}">Aktuelle Frucht:</label>
            <select id="currentCrop-${fieldId}" class="form-control mb-2">
                ${generateCropOptions(field.crop)}
            </select>
            <div class="recommended-rotations mb-2">
                <strong>Empfohlene Fruchtfolge:</strong> ${rotationsText}
            </div>
            <button class="btn btn-primary btn-block mb-2" onclick="saveField(${fieldId})">Speichern</button>
            <hr>
            <h6>Aufgaben:</h6>
            <ul>${taskList}</ul>
            <input type="text" id="task-${fieldId}" class="form-control mb-2" placeholder="Neue Aufgabe eingeben">
            <select id="task-priority-${fieldId}" class="form-control mb-2">
                <option value="Hoch">Hoch</option>
                <option value="Mittel">Mittel</option>
                <option value="Niedrig">Niedrig</option>
            </select>
            <button class="btn btn-secondary btn-block" onclick="addTask(${fieldId})">Aufgabe hinzufügen</button>
        </div>
    `;
    layer && layer.bindPopup(popupContent);
};

const saveState = () => {
    const state = {
        fields,
        drawnItemsGeoJSON: drawnItems.toGeoJSON()
    };
    localStorage.setItem('mapState', JSON.stringify(state));
};

const loadState = () => {
    const stateJSON = localStorage.getItem('mapState');
    if (stateJSON) {
        const state = JSON.parse(stateJSON);
        fields = state.fields || [];
        const geoJSON = state.drawnItemsGeoJSON;
        if (geoJSON) {
            L.geoJSON(geoJSON, {
                style: feature => ({
                    color: feature.properties.color,
                    fillColor: feature.properties.fillColor,
                    fillOpacity: feature.properties.fillOpacity
                }),
                onEachFeature: (feature, layer) => {
                    const fieldId = feature.properties.fieldId;
                    layer._fieldId = fieldId;
                    drawnItems.addLayer(layer);
                    const field = fields.find(f => f.id === fieldId);
                    const cropInfo = cropRotation[field.crop] || {};
                    updatePopupContent(fieldId, cropInfo, layer);
                    updateFieldLabel(fieldId, layer);
                }
            });
        }
    }
};

// Karten-Eventlistener
map.on(L.Draw.Event.CREATED, event => {
    const layer = event.layer;
    drawnItems.addLayer(layer);
    const fieldId = fields.length + 1;
    fields.push({ id: fieldId, crop: "", number: "", manualArea: 0, tasks: [] });
    layer._fieldId = fieldId;
    layer.feature = { type: "Feature", properties: { fieldId, color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.6 } };
    const popupContent = `
        <div class="p-2">
            <label for="fieldNumber-${fieldId}">Feldnummer:</label>
            <input type="text" id="fieldNumber-${fieldId}" class="form-control mb-2" placeholder="Feldnummer eingeben">
            <label for="manualArea-${fieldId}">Hektar (manuell eingeben):</label>
            <input type="number" id="manualArea-${fieldId}" class="form-control mb-2" placeholder="Hektar eingeben">
            <label for="currentCrop-${fieldId}">Aktuelle Frucht:</label>
            <select id="currentCrop-${fieldId}" class="form-control mb-2">
                ${generateCropOptions()}
            </select>
            <button class="btn btn-primary btn-block" onclick="saveField(${fieldId})">Speichern</button>
        </div>
    `;
    layer.bindPopup(popupContent).openPopup();
    saveState();
});

// Feld speichern
const saveField = fieldId => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    field.crop = document.getElementById(`currentCrop-${fieldId}`).value;
    field.number = document.getElementById(`fieldNumber-${fieldId}`).value;
    field.manualArea = parseFloat(document.getElementById(`manualArea-${fieldId}`).value) || 0;
    const cropInfo = cropRotation[field.crop] || {};
    const color = cropInfo.color || '#ffffff';
    const layer = drawnItems.getLayers().find(l => l._fieldId === fieldId);
    if (layer) {
        layer.setStyle({ color, fillColor: color, fillOpacity: 0.6 });
        layer.feature.properties = { ...layer.feature.properties, color, fillColor: color, fillOpacity: 0.6 };
        updatePopupContent(fieldId, cropInfo, layer);
        updateFieldLabel(fieldId, layer);
    }
    saveState();
};

// Aufgabe hinzufügen
const addTask = fieldId => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    const taskText = document.getElementById(`task-${fieldId}`).value.trim();
    const taskPriority = document.getElementById(`task-priority-${fieldId}`).value;
    if (taskText) {
        field.tasks.push({ text: taskText, priority: taskPriority });
        document.getElementById(`task-${fieldId}`).value = '';
        updatePopupContent(fieldId, cropRotation[field.crop], drawnItems.getLayers().find(l => l._fieldId === fieldId));
        saveState();
    }
};

// Aufgabe löschen
const deleteTask = (fieldId, taskIndex, updateList = false) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    if (field.tasks[taskIndex]) {
        field.tasks.splice(taskIndex, 1);
        updatePopupContent(fieldId, cropRotation[field.crop], drawnItems.getLayers().find(l => l._fieldId === fieldId));
        if (updateList) updateTaskList();
        saveState();
    }
};

// Aufgabenliste aktualisieren
const updateTaskList = () => {
    const taskListContainer = document.getElementById('task-list');
    taskListContainer.innerHTML = '';
    fields.forEach(field => {
        if (field.tasks.length > 0) {
            const fieldSection = document.createElement('div');
            fieldSection.className = 'mb-3';
            fieldSection.innerHTML = `<h6>Feld ${field.number || field.id} - Aufgaben:</h6>`;
            const taskList = document.createElement('ul');
            taskList.style.listStyleType = 'none';
            field.tasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = 'd-flex justify-content-between align-items-center';
                taskItem.innerHTML = `
                    <span>${task.text}</span>
                    <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
                    <button class="btn btn-danger btn-sm ml-2" onclick="deleteTask(${field.id}, ${index}, true)">Löschen</button>
                `;
                taskList.appendChild(taskItem);
            });
            fieldSection.appendChild(taskList);
            taskListContainer.appendChild(fieldSection);
        }
    });
    if (taskListContainer.innerHTML === '') {
        taskListContainer.innerHTML = '<p>Keine Aufgaben vorhanden.</p>';
    }
};

// Aufgabenliste umschalten
const toggleTaskList = () => {
    const taskListContainer = document.getElementById('task-list');
    if (taskListContainer.style.display === 'none' || taskListContainer.style.display === '') {
        updateTaskList();
        taskListContainer.style.display = 'block';
    } else {
        taskListContainer.style.display = 'none';
    }
};

// Daten exportieren
const exportData = () => {
    const dataStr = JSON.stringify({ fields, drawnItemsGeoJSON: drawnItems.toGeoJSON() }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'felddaten_und_geometrien.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
};

// Daten importieren
const importData = event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
        try {
            const importedData = JSON.parse(event.target.result);
            fields = importedData.fields || [];
            const geoJSON = importedData.drawnItemsGeoJSON;
            drawnItems.clearLayers();
            labelMarkers.forEach(marker => map.removeLayer(marker));
            labelMarkers.clear();
            if (geoJSON) {
                L.geoJSON(geoJSON, {
                    style: feature => ({
                        color: feature.properties.color,
                        fillColor: feature.properties.fillColor,
                        fillOpacity: feature.properties.fillOpacity
                    }),
                    onEachFeature: (feature, layer) => {
                        const fieldId = feature.properties.fieldId;
                        layer._fieldId = fieldId;
                        drawnItems.addLayer(layer);
                        const field = fields.find(f => f.id === fieldId);
                        const cropInfo = cropRotation[field.crop] || {};
                        updatePopupContent(fieldId, cropInfo, layer);
                        updateFieldLabel(fieldId, layer);
                    }
                });
            }
            saveState();
            alert('Daten erfolgreich importiert.');
        } catch (error) {
            console.error('Fehler beim Importieren der Daten:', error);
            alert('Fehler beim Importieren der Daten.');
        }
    };
    reader.readAsText(file);
};

document.getElementById('import-btn').addEventListener('change', importData);

// Feldsuche
const searchField = () => {
    const searchValue = document.getElementById('search-input').value.trim();
    const field = fields.find(f => f.number === searchValue);
    if (field) {
        const layer = drawnItems.getLayers().find(l => l._fieldId === field.id);
        if (layer) {
            map.fitBounds(layer.getBounds());
            layer.openPopup();
        }
    } else {
        alert('Feld nicht gefunden');
    }
};