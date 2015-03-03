var map = L.map('map').setView([38.1139, -122.2241], 12);
var dots = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.2241, 38.1139]
    }
}];
var myStyle = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
var year = function(feature,layer) {
    //return feature.properties.year == document.getElementById('year').value;
    return true;
}
var styleFunc = function(feature,latlng) {
    return L.circleMarker(latlng, myStyle);
}
L.geoJson(data, {pointToLayer: styleFunc, filter:year}).addTo(map);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
