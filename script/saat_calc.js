
const crops = [
    { name: 'Weizen', seedUsagePerSqm: 0.05, density: 0.75 },
    { name: 'Winterweizen', seedUsagePerSqm: 0.05, density: 0.75 },
    { name: 'Gerste', seedUsagePerSqm: 0.05, density: 0.65 },
    { name: 'Wintergerste', seedUsagePerSqm: 0.05, density: 0.65 },
    { name: 'Hafer', seedUsagePerSqm: 0.05, density: 0.43 },
    { name: 'Triticale', seedUsagePerSqm: 0.05, density: 0.68 },
    { name: 'Roggen', seedUsagePerSqm: 0.05, density: 0.70 },
    { name: 'Sorghum', seedUsagePerSqm: 0.02, density: 0.75 },
    { name: 'Mais', seedUsagePerSqm: 0.04, density: 0.75 },
    { name: 'Silomais', seedUsagePerSqm: 0.04, density: 0.75 },
    { name: 'Silage-Sorghum', seedUsagePerSqm: 0.04, density: 0.75 },
    { name: 'Vetch-Roggen', seedUsagePerSqm: 0.05, density: 0.70 },
    { name: 'Kartoffel', seedUsagePerSqm: 0.0297, density: 0.70 },
    { name: 'Stärkekartoffel', seedUsagePerSqm: 0.0297, density: 0.70 },
    { name: 'Zuckerrübe', seedUsagePerSqm: 0.004, density: 0.70 },
    { name: 'Futterrübe', seedUsagePerSqm: 0.004, density: 0.70 },
    { name: 'Karotte', seedUsagePerSqm: 0.001, density: 0.60 },
    { name: 'Futterkarotte', seedUsagePerSqm: 0.001, density: 0.60 },
    { name: 'Zwiebel', seedUsagePerSqm: 0.001, density: 0.60 },
    { name: 'Rote Bete', seedUsagePerSqm: 0.001, density: 0.70 },
    { name: 'Pastinake', seedUsagePerSqm: 0.001, density: 0.70 },
    { name: 'Sonnenblume', seedUsagePerSqm: 0.03, density: 0.65 },
    { name: 'Raps', seedUsagePerSqm: 0.02, density: 0.60 },
    { name: 'Leinsamen', seedUsagePerSqm: 0.05, density: 0.65 },
    { name: 'Sojabohne', seedUsagePerSqm: 0.03, density: 0.75 },
    { name: 'Lupine', seedUsagePerSqm: 0.03, density: 0.65 },
    { name: 'Luzerne', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Klee', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Kleegras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Gras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Wiese', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Pferdegras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Feldgras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Kräutergras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Weidegras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Landschaftsgras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Straßengras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Obstgarten-Gras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Rasengras', seedUsagePerSqm: 0.03, density: 0.60 },
    { name: 'Ölrettich', seedUsagePerSqm: 0.01, density: 0.65 },
    { name: 'Senf', seedUsagePerSqm: 0.01, density: 0.65 },
    { name: 'Blumenmischung', seedUsagePerSqm: 0.01, density: 0.60 },
    { name: 'Sommermischung', seedUsagePerSqm: 0.01, density: 0.60 },
    { name: 'Wintermischung', seedUsagePerSqm: 0.01, density: 0.60 },
    { name: 'Maismischung', seedUsagePerSqm: 0.01, density: 0.60 },
    { name: 'BetaMaxx', seedUsagePerSqm: 0.01, density: 0.60 },
    { name: 'NFixx', seedUsagePerSqm: 0.01, density: 0.60 },
    { name: 'SolaRigol', seedUsagePerSqm: 0.01, density: 0.60 },
    { name: 'Landsberger Gemenge', seedUsagePerSqm: 0.01, density: 0.60 },
    { name: 'Pappel', seedUsagePerSqm: 0.15, density: 0.60 }
];

   


const cropSelect = document.getElementById('crop');
crops.forEach(crop => {
    const option = document.createElement('option');
    option.value = crop.name;
    option.text = crop.name;
    cropSelect.appendChild(option);
});

function calculateSeed() {
    const areaHa = parseFloat(document.getElementById('area').value);
    const cropName = document.getElementById('crop').value;
    const crop = crops.find(c => c.name === cropName);

    if (isNaN(areaHa) || areaHa <= 0) {
        alert('Bitte geben Sie eine gültige Fläche ein.');
        return;
    }

    if (!crop) {
        alert('Bitte wählen Sie eine gültige Fruchtart aus.');
        return;
    }

    const areaSqm = areaHa * 10000;
    const totalLiters = areaSqm * crop.seedUsagePerSqm;
    const totalKg = totalLiters * crop.density;
    const totalTons = totalKg / 1000;

    document.getElementById('resultTons').innerText = `Gesamtmenge: ${totalTons.toFixed(2)} Tonnen`;
    document.getElementById('resultL').innerText = `Gesamtmenge: ${totalLiters.toFixed(2)} Liter`;
}
