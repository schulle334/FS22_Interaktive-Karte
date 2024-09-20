
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 5,
    zoomControl: true,
    maxBounds: [[0, 0], [4049, 4049]], 
    maxBoundsViscosity: 1.0 
});
map.setView([1024, 1024], -1); 
const imageUrl1 = './pda/pda_1.png';
const imageUrl2 = './pda/pda_2.png';
const imageBounds = [[0, 0], [4049, 4049]];
const baseLayer = L.imageOverlay(imageUrl1, imageBounds, { interactive: true, noWrap: true }).addTo(map);
const secondLayer = L.imageOverlay(imageUrl2, imageBounds, { interactive: true, noWrap: true });
const baseMaps = {
    "PDA 1": baseLayer,
    "PDA 2": secondLayer
};
L.control.layers(baseMaps).addTo(map);
L.control.scale({ imperial: false }).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        polyline: false,
        marker: false,
        circlemarker: false
    }
});
map.addControl(drawControl);
let fields = [];
let cropRotation = {};
const labelMarkers = new Map();
fetch('./src/crop.json')
    .then(response => response.json())
    .then(data => {
        cropRotation = data;
        console.log("Saat- und erweiterte Farbdaten erfolgreich geladen:", cropRotation);
        loadState();
    })
    .catch(error => console.error("Fehler beim Laden der Saat-Daten:", error));
function generateCropOptions(selectedCrop = "") {
    let options = '<option value="">Wähle Saat</option>';
    for (const crop in cropRotation) {
        if (cropRotation.hasOwnProperty(crop)) {
            options += `<option value="${crop}" ${crop === selectedCrop ? 'selected' : ''}>${cropRotation[crop].name}</option>`;
        }
    }
    return options;
}
map.on(L.Draw.Event.CREATED, event => {
    const layer = event.layer;
    drawnItems.addLayer(layer);
    const fieldId = fields.length + 1;
    fields.push({
        id: fieldId,
        crop: "",
        number: "",
        manualArea: 0, 
        tasks: []
    });
    layer._fieldId = fieldId;
    if (!layer.feature) layer.feature = { type: "Feature", properties: {} };
    layer.feature.properties.fieldId = fieldId;
    layer.feature.properties.color = '#3388ff';
    layer.feature.properties.fillColor = '#3388ff';
    layer.feature.properties.fillOpacity = 0.6;
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
function saveField(fieldId) {
    const field = fields.find(f => f.id === fieldId);
    if (!field) {
        console.error(`Feld mit ID ${fieldId} nicht gefunden.`);
        return;
    }
    const currentCrop = document.getElementById(`currentCrop-${fieldId}`).value;
    const fieldNumber = document.getElementById(`fieldNumber-${fieldId}`).value;
    const manualArea = parseFloat(document.getElementById(`manualArea-${fieldId}`).value) || 0;
    field.crop = currentCrop;
    field.number = fieldNumber;
    field.manualArea = manualArea; 
    const cropInfo = cropRotation[currentCrop] || {};
    const color = cropInfo.color || '#ffffff';
    const layer = drawnItems.getLayers().find(l => l._fieldId === fieldId);  
    if (layer) {
        layer.setStyle({ color: color, fillColor: color, fillOpacity: 0.6 });
        if (!layer.feature) layer.feature = { type: "Feature", properties: {} };
        layer.feature.properties.color = color;
        layer.feature.properties.fillColor = color;
        layer.feature.properties.fillOpacity = 0.6;
        layer.feature.properties.fieldId = fieldId;
        updatePopupContent(fieldId, cropInfo, layer);
        updateFieldLabel(fieldId, layer);
    }
    saveState();
}
function updateFieldLabel(fieldId, layer) {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    if (labelMarkers.has(fieldId)) {
        map.removeLayer(labelMarkers.get(fieldId));
    }
    const center = layer.getBounds().getCenter();
    const labelIcon = L.divIcon({
        className: 'field-label',
        html: `<div>${field.number || fieldId}</div>`
    });
    const labelMarker = L.marker(center, { icon: labelIcon, interactive: false });
    labelMarker.addTo(map);
    labelMarkers.set(fieldId, labelMarker);
}
function updatePopupContent(fieldId, cropInfo, layer) {
    const field = fields.find(f => f.id === fieldId);
    if (!field) {
        console.error(`Feld mit ID ${fieldId} nicht gefunden.`);
        return;
    }
    const recommendedRotations = cropInfo.recommendedRotations || [];
    const rotationsText = recommendedRotations.length > 0
        ? recommendedRotations.join(', ')
        : 'Keine Empfehlungen';
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
    if (layer) {
        layer.bindPopup(popupContent);
    }
}
function addTask(fieldId) {
    const field = fields.find(f => f.id === fieldId);
    if (!field) {
        console.error(`Feld mit ID ${fieldId} nicht gefunden.`);
        return;
    }
    const taskInput = document.getElementById(`task-${fieldId}`);
    const taskPriority = document.getElementById(`task-priority-${fieldId}`).value;
    const taskText = taskInput.value.trim();
    if (taskText) {
        field.tasks.push({ text: taskText, priority: taskPriority });
        taskInput.value = ''; 
        updatePopupContent(fieldId, cropRotation[field.crop], drawnItems.getLayers().find(l => l._fieldId === fieldId));
        saveState(); 
    }
}
function deleteTask(fieldId, taskIndex, updateList = false) {
    const field = fields.find(f => f.id === fieldId);
    if (!field) {
        console.error(`Feld mit ID ${fieldId} nicht gefunden.`);
        return;
    }
    if (field.tasks[taskIndex] !== undefined) {
        field.tasks.splice(taskIndex, 1);
        updatePopupContent(fieldId, cropRotation[field.crop], drawnItems.getLayers().find(l => l._fieldId === fieldId));
        if (updateList) updateTaskList(); 
        saveState(); 
    }
}
function toggleTaskList() {
    const taskListContainer = document.getElementById('task-list');

    if (taskListContainer.style.display === 'none' || taskListContainer.style.display === '') {
        updateTaskList();
        taskListContainer.style.display = 'block';
    } else {
        taskListContainer.style.display = 'none';
    }
}
function updateTaskList() {
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
}
function saveState() {
    const state = {
        fields: fields,
        drawnItemsGeoJSON: drawnItems.toGeoJSON()
    };
    localStorage.setItem('mapState', JSON.stringify(state));
}
function loadState() {
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
}
function exportData() {
    const exportData = {
        fields: fields,
        drawnItemsGeoJSON: drawnItems.toGeoJSON()
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'felddaten_und_geometrien.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
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
}
document.getElementById('import-btn').addEventListener('change', importData);
function searchField() {
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
}