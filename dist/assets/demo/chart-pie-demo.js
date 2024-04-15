// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Load data from CSV file
d3.csv("datalogs.csv").then(function(data) {
  // Parse the dates and convert the other columns to numbers
  data.forEach(function(datapoints) {
    datapoints.water = +datapoints.water;
  });

  // Create arrays for the labels and each dataset
  var waterData = data.map(function(datapoints) { return datapoints.water;});

  // Calculate the percentage of water remaining
  var waterPercentage = waterData.map(function(water) { return (water / 10) * 100; });

  // Pie Chart Example
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    label: "Water Level",
    data: {
      labels: ["Full", "Empty"],
      datasets: [{
        data: [waterPercentage[0], 100 - waterPercentage[0]], // Use the calculated water percentage
        backgroundColor: ['#007bff', '#dc3545'],
      }],
    },
  });
});
