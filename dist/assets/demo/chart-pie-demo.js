// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Function to create a pie chart
function createPieChart(ctx, data) {
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Percent Full", "Percent Empty"],
      datasets: [{
        data: data,
        backgroundColor: ['#007bff', '#dc3545'],
      }],
    },
  });
}

// Read configuration file
fetch('config.json')
  .then(response => response.json())
  .then(config => {
    const UPDATE_INTERVAL = config.updateInterval;

    // Load initial data from CSV file and create pie chart
    d3.csv("datalogs.csv").then(function (data) {
      data.forEach(function (datapoints) {
        datapoints.water = +datapoints.water;
      });

      var waterData = data.map(function (datapoints) { return datapoints.water; });
      var lastWaterLevel = waterData[waterData.length - 1];

      var ctx = document.getElementById("myPieChart").getContext("2d");
      var myPieChart = createPieChart(ctx, [lastWaterLevel, 100 - lastWaterLevel]);

      // Function to update pie chart
      var updatePieChart = function (chart, data) {
        chart.data.datasets[0].data = data;
        chart.update();
      };

      // Function to fetch data and update pie chart
      var fetchDataAndUpdatePieChart = function () {
        d3.csv("datalogs.csv").then(function (data) {
          data.forEach(function (datapoints) {
            datapoints.water = +datapoints.water;
          });

          var waterData = data.map(function (datapoints) { return datapoints.water; });
          var lastWaterLevel = waterData[waterData.length - 1];

          updatePieChart(myPieChart, [lastWaterLevel, 100 - lastWaterLevel]);
        });
      };

      // Set interval to update pie chart
      setInterval(fetchDataAndUpdatePieChart, UPDATE_INTERVAL);
    }).catch(function (error) {
      console.log(error);
    });
  });