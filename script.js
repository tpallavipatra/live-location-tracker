let locations = [];
let map;
let marker;
let path = [];
let polyline;
let totalDistance = 0;
let previousLatLng = null;
function startTracking() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showLiveLocation, showError, {
            enableHighAccuracy: true
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showLiveLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    const speed = position.coords.speed;
    const speedKmph = speed ? (speed * 3.6).toFixed(2) : 0;

    if (previousLatLng) {
        totalDistance += calculateDistance(
            previousLatLng.lat,
            previousLatLng.lng,
            lat,
            lng
        );
    }

    previousLatLng = { lat, lng };

    document.getElementById("lat").innerHTML = lat.toFixed(6);
    document.getElementById("lng").innerHTML = lng.toFixed(6);
    document.getElementById("accuracy").innerHTML = accuracy.toFixed(2) + " m";
    document.getElementById("speed").innerHTML = speedKmph + " km/h";
    document.getElementById("distance").innerHTML =
    totalDistance.toFixed(3) + " km";
    locations.push({
        latitude: lat,
        longitude: lng,
        accuracy: accuracy,
        time: new Date().toLocaleTimeString()
    });

    const table = document.getElementById("historyTable");
    const row = table.insertRow(-1);

    row.insertCell(0).innerHTML = new Date().toLocaleTimeString();
    row.insertCell(1).innerHTML = lat.toFixed(6);
    row.insertCell(2).innerHTML = lng.toFixed(6);

    if (!map) {
        map = L.map('map').setView([lat, lng], 16);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);
    }

    if (!marker) {
        marker = L.marker([lat, lng]).addTo(map);
    } else {
        marker.setLatLng([lat, lng]);
    }

    marker.bindPopup("You are here!").openPopup();
    map.setView([lat, lng], 16);

    path.push([lat, lng]);

    if (!polyline) {
        polyline = L.polyline(path).addTo(map);
    } else {
        polyline.setLatLngs(path);
    }
}
function showError(error) {
    alert("Please allow location permission.");
}