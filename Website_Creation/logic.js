document.addEventListener("DOMContentLoaded", function () {
//fetch the GeoJSON data
  fetch('NREL_GeoJSON.geojson')
    .then(response => {
      return response.json();
    })
    .then(data => {
//create the map
      let myMap = L.map("map", {
        center: [39.155907, -76.717216],
        zoom: 7.5
      });

      // Add the street layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(myMap);

//process the GeoJSON data and add markers
      L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          if (feature.properties) {
            let popupContent = `<strong>${feature.properties['Station Name']}</strong><br>
                                ID: ${feature.properties['ID']}<br>
                                Address: ${feature.properties['Address']}, ${feature.properties['City']}, ${feature.properties['State']} ${feature.properties['Zipcode']}<br>
                                Access: ${feature.properties['Access']}<br>
                                Owner: ${feature.properties['Owner']}<br>
                                Last Used: ${feature.properties['Last_Used']}<br>
                                Open Date: ${feature.properties['Open_Date']}<br>
                                Connection Type: ${feature.properties['Connection_Type']}`;
            layer.bindPopup(popupContent);
          }
        }
      }).addTo(myMap);

//click to open new HTML
      myMap.on('click', function() {
        window.open('map.html', '_blank'); 
      });
    });
});