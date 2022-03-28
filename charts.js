function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//1. Create the buildCharts function.
function buildCharts(sample) {
  //2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //3. Create a variable that holds the samples array. 
    let samples = data.samples;
    //4. Create a variable that filters the samples for the object with the desired sample number.
    let result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    //5. Create a variable that filters the metadata array for the object with the desired sample number.
    let filteredMetada = data.metadata.filter(sampleObj => sampleObj.id == sample )[0];

    // Create a variable that holds the washing frequency.
    let wfreq = parseInt(filteredMetada["wfreq"])

    //6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = result["otu_ids"];
    let otu_labels = result["otu_labels"];
    let sample_values = result["sample_values"];

    //7. Create the yticks for the bar chart.
    var topTenValues = sample_values.slice(0, 10).reverse();
    var topTenIds = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var topTenLabels = otu_labels.slice(0, 10).reverse();

    //8. Create the trace for the bar chart. 
    var barData = [{
      x: topTenValues,
      y: topTenIds,
      text: topTenLabels,
      type: "bar",
      orientation: 'h'
    }];

    //9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      yaxis:{type: "category"}
    };

    //10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout)

    //after step 10, starts recounting from 1

    //1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Portland'
      }
    }];

    //2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteris Cultures Per Sample</b>",
      xaxis: {title: "OTU"},
      hovermode: "closest"
    };

    //3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)

    //4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "Scrubs per Week" },
      gauge: {
        axis: { range: [null, 10] ,
                tick0: 0,
                dtick: 2},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" },
        ],
        bar: { color: "black" }
      }
      }];

    //5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "<b>Belly Button Washing Frequency</b>"
    };

    //6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)

  });
}