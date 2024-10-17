document.addEventListener("DOMContentLoaded", function () {
  let globalData;

  // Fetch the GeoJSON data
  fetch('NREL_GeoJSON.geojson')
      .then(response => response.json())
      .then(data => {
          globalData = data;
          populateStateDropdown(); // Populate the state dropdown
          populateCityDropdown();  // Populate the city dropdown based on the initial state
          setDefaultCity("Hanover"); // Set Hanover as the default city and load the charts
      });

  // Function to populate the state dropdown menu
  function populateStateDropdown() {
      const stateSet = new Set();

      // Extract unique state names from the data
      globalData.features.forEach(feature => {
          const state = feature.properties.State;
          if (state) {
              stateSet.add(state);
          }
      });

      const stateDropdown = document.getElementById("dropdown-state");
      stateDropdown.innerHTML = ""; // Clear any existing options

      // Add a default option
      const defaultOption = document.createElement("option");
      defaultOption.text = "Select a State";
      defaultOption.value = "";
      stateDropdown.appendChild(defaultOption);

      // Add state options to the dropdown
      stateSet.forEach(state => {
          const option = document.createElement("option");
          option.text = state;
          option.value = state;
          stateDropdown.appendChild(option);
      });
  }

  // Function to populate the city dropdown menu based on the selected state
  function populateCityDropdown() {
      const citySet = new Set();
      const selectedState = document.getElementById("dropdown-state").value;

      // Extract unique city names for the selected state from the data
      globalData.features.forEach(feature => {
          const city = feature.properties.City;
          const state = feature.properties.State;
          if (city && state === selectedState) {
              citySet.add(city);
          }
      });

      const cityDropdown = document.getElementById("dropdown-city");
      cityDropdown.innerHTML = ""; // Clear any existing options

      // Add a default option
      const defaultOption = document.createElement("option");
      defaultOption.text = "Select a City";
      defaultOption.value = "";
      cityDropdown.appendChild(defaultOption);

      // Add city options to the dropdown
      citySet.forEach(city => {
          const option = document.createElement("option");
          option.text = city;
          option.value = city;
          cityDropdown.appendChild(option);
      });
  }

  // Function to set the default city and load its charts
  function setDefaultCity(cityName) {
      const cityDropdown = document.getElementById("dropdown-city");
      cityDropdown.value = cityName;
      drawPlotlyCharts(cityName);
  }

  // Function to calculate sums for charging stations in a city
  function calculateStationSums(cityName) {
      let dcFastSum = 0;
      let level1Sum = 0;
      let level2Sum = 0;
      let vendorCounts = {};

      globalData.features.forEach(feature => {
          const properties = feature.properties;
          if (properties.City === cityName) {
              dcFastSum += parseFloat(properties.DC_Fast) || 0;
              level1Sum += parseFloat(properties.Level1_Charging) || 0;
              level2Sum += parseFloat(properties.Level2_Charging) || 0;

              // Count vendors
              const owner = properties.Owner;
              vendorCounts[owner] = (vendorCounts[owner] || 0) + 1;
          }
      });

      // Get top 4 vendors
      const topVendors = Object.entries(vendorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);

      return {
          dcFastSum,
          level1Sum,
          level2Sum,
          topVendors
      };
  }

  // Function to draw bar charts with Plotly
  function drawPlotlyCharts(cityName) {
      if (!cityName || cityName === "Select a City") {
          return; // Do nothing if no valid city is selected
      }

      const { dcFastSum, level1Sum, level2Sum, topVendors } = calculateStationSums(cityName);

      // Clear previous charts
      Plotly.purge('bar-chart1');
      Plotly.purge('bar-chart2');

      // Charging stations bar chart
      const data1 = [
          {
              x: ['DC Fast', 'Level 1', 'Level 2'],
              y: [dcFastSum, level1Sum, level2Sum],
              type: 'bar',
              marker: { color: ['red', 'orange', 'green'] }
          }
      ];
      const layout1 = {
          title: `Charging Stations by Type in ${cityName}`,
          xaxis: { title: 'Type' },
          yaxis: { title: 'Count' }
      };
      Plotly.newPlot('bar-chart1', data1, layout1);

      // Top vendors bar chart
      const data2 = [
          {
              x: topVendors.map(v => v[0]),
              y: topVendors.map(v => v[1]),
              type: 'bar',
              marker: { color: 'blue' }
          }
      ];
      const layout2 = {
          title: `Top 4 Vendors in ${cityName}`,
          xaxis: { title: 'Vendor' },
          yaxis: { title: 'Count' }
      };
      Plotly.newPlot('bar-chart2', data2, layout2);
  }

  // Event listener for the state dropdown
  document.getElementById("dropdown-state").addEventListener("change", () => {
      populateCityDropdown(); // Update city dropdown based on the selected state
  });

  // Event listener for the city dropdown
  document.getElementById("dropdown-city").addEventListener("change", (event) => {
      const cityName = event.target.value;
      drawPlotlyCharts(cityName);
  });
});