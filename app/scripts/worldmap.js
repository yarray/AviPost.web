const L = require('leaflet');

function worldmap(root) {
    const map = L.map(root).setView([51.3, 9.46], 10);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
}

module.exports = worldmap;
