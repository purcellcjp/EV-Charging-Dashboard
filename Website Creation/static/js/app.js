//data fetch
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data){
  console.log(data);

//log data
  console.log(data)

//log + store ids
  let names = data.names
  console.log(names)
//log + store metadata
  let metadata = data.metadata
  console.log(metadata)
//log + store samples
  let samples = data.samples
  console.log(samples)

//getting data for bar chart
  let samplesValues = samples.map(function (row){
    return row.sample_values;
  });
  samplesValues = samplesValues[0]
  console.log(samplesValues)

  let samplesIDs = samples.map(function (row){
    return row.otu_ids;
  });
  samplesIDs = samplesIDs[0]
  console.log(samplesIDs)

//slicing data for top 10
    let slicedIDs = samplesIDs.slice(0, 10);
    let slicedValues = samplesValues.slice(0,10);
    console.log(slicedIDs)
    console.log(slicedValues)

//concatanation
    for (let i = 0; i < slicedIDs.length;i++){
      slicedIDs[i] = "OTU " + slicedIDs[i]
      
    };
//creating bar chart
    let trace1 = {
      x: slicedValues.reverse(),
      y: slicedIDs.reverse(),
      type: "bar",
      orientation: "h"
    };
    data = [trace1]

    let layout = {
      
      title:"Top 10 Bacteria Cultures Found",
      xaxis: {
        title: { text: "Number of Bacteria" },
    },

    };

    Plotly.newPlot("bar", data, layout);

//creating bubble chart

let trace2 = {
  x: samplesIDs,
  y: samplesValues,
  mode: "markers",
  marker: {
      size:samplesValues,
      color: samplesIDs,
      colorscale: "Pastel"
      
  },
  type: "scatter",
};
let data2 = [trace2];

let layout2 = {

  title:"Bacteria Cultures per Sample",
  xaxis: {
      title: { text: "OTU ID" },
  },
  yaxis: {
    title:{text: "Number of Bacteria"}
  }
};
Plotly.newPlot("bubble", data2, layout2);


//appending values to drop down menu
let dropdown = d3.select("#selDataset");
names.forEach((id) => {
  dropdown.append("option").text(id).property("value", id);
});

//grabbing user option

d3.selectAll("#selDataset").on("change", getData);
let demographicBox = d3.select("#sample-metadata");

//default metadata box

let metadataBox1 = metadata.find(metadataBox1 => metadataBox1.id = 940)
  demographicBox.html(
  `ID: ${metadataBox1.id} <br> 
  ETHNICITY: ${metadataBox1.ethnicity} <br>
  GENDER: ${metadataBox1.gender} <br>
  AGE: ${metadataBox1.age} <br>
  LOCATION: ${metadataBox1.location} <br>
  BBTYPE: ${metadataBox1.bbtype} <br>
  WFREQ: ${metadataBox1.wfreq}`
  );


  //return metadata box info

function getData() {
  
  let selectedId = dropdown.property("value");

  let metadataBox = metadata.find((metadataBox) => metadataBox.id == selectedId);
  demographicBox.html(
  `id: ${metadataBox.id} <br> 
  ethnicity: ${metadataBox.ethnicity} <br>
  gender: ${metadataBox.gender} <br>
  age: ${metadataBox.age} <br>
  location: ${metadataBox.location} <br>
  bbtype: ${metadataBox.bbtype} <br>
  wfreq: ${metadataBox.wfreq}`
  );
  

  
  
}

});