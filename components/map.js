/* global L */

export default class MapView extends HTMLElement {
    constructor() {
        super();

        this.map = null;
        this.projectid = "";
        this.markers = [];
    }

    static get observedAttributes() {
        return ['projectid'];
    }

    // attribute change
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        this[property] = newValue;
    }

    connectedCallback() {
        this.innerHTML = `<div id="map" class="map"></div>`;

        this.renderMap();
    }

    renderMap() {
        this.map = L.map('map').setView([56.18219, 15.59094], 11);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.renderMarkers();
    }

    async renderMarkers() {
        const response = await fetch(`http://localhost:8866/images/${this.projectid}`);

        const result = await response.json();

        for (let i = 0; i < result.data.length; i++) {
            let image = result.data[i];

            L.marker([image.latitude, image.longitude]).addTo(this.map)
                .bindPopup(`<img src="${image.url}" style="width: 200px;" />`);
        }
    }
}
