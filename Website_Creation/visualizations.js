// Function to draw the static line graph
function drawLineGraph() {
  // D3.js code to create the line graph goes here
  const svg = d3.select("#line-graph")
    .append("svg")
    .attr("width", 600)
    .attr("height", 400);
  
  // Example static line graph data
  const data = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 4 },
    { x: 3, y: 9 },
    { x: 4, y: 16 }
  ];

  const line = d3.line()
    .x(d => d.x * 100)
    .y(d => 400 - d.y * 20); // Flip the y-axis

  svg.append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "blue");
}

// Function to draw dynamic bar charts based on dropdown selection
function drawBarCharts(selection) {
  // Clear previous charts
  d3.select("#bar-chart1").selectAll("*").remove();
  d3.select("#bar-chart2").selectAll("*").remove();

  // Example data based on selection
  const data1 = selection === 'option1' ? [10, 20, 30] : [20, 30, 10];
  const data2 = selection === 'option1' ? [15, 25, 35] : [25, 35, 15];

  // Create bar chart 1
  const svg1 = d3.select("#bar-chart1")
    .append("svg")
    .attr("width", 400)
    .attr("height", 200);

  svg1.selectAll("rect")
    .data(data1)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 100)
    .attr("y", d => 200 - d * 5)
    .attr("width", 80)
    .attr("height", d => d * 5)
    .attr("fill", "orange");

  // Create bar chart 2
  const svg2 = d3.select("#bar-chart2")
    .append("svg")
    .attr("width", 400)
    .attr("height", 200);

  svg2.selectAll("rect")
    .data(data2)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 100)
    .attr("y", d => 200 - d * 5)
    .attr("width", 80)
    .attr("height", d => d * 5)
    .attr("fill", "green");
}

// Event listener for the dropdown
document.getElementById("dropdown").addEventListener("change", (event) => {
  drawBarCharts(event.target.value);
});

// Initial drawing of the graphs
drawLineGraph();
drawBarCharts(document.getElementById("dropdown").value);