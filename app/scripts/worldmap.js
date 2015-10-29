const L = require('leaflet');
const { map } = require('ramda');


const markerIcon = src => L.icon({
    iconUrl: src,
    iconSize: [60, 60],
});


function worldmap(root, postcards) {
    L.Icon.Default.imagePath = 'images/leaflet/';

    const worldMap = L.map(root).setView([51.3, 9.46], 3);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{retina}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        retina: '@2x',
    }).addTo(worldMap);

    postcards.get().then(
        map(({ latitude, longitude, cover }) => {
            L.marker([ latitude, longitude ], { icon: markerIcon('images/messenger.png') })
                .bindPopup(`<img src="${cover}">`, { closeButton: false, keepInView: true })
                .addTo(worldMap);
        })
    );

    worldMap.on('popupopen', () => root.classList.add('card-view'));
    worldMap.on('popupclose', () => root.classList.remove('card-view'));
}

module.exports = worldmap;
