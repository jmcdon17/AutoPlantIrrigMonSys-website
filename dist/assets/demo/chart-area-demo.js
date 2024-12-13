// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Function to create a chart
function createChart(ctx, label, data, backgroundColor, borderColor, yMax) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: label,
        lineTension: 0.3,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        pointRadius: 3,
        pointBackgroundColor: borderColor,
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: borderColor,
        pointHitRadius: 5,
        pointBorderWidth: 2,
        data: data.values,
        hidden: false,
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: yMax
          }
        }]
      }
    }
  });
}

// Read configuration file
fetch('config.json')
  .then(response => response.json())
  .then(config => {
    const UPDATE_INTERVAL = config.updateInterval;

    // Load initial data from CSV file and create charts
    d3.csv("datalogs.csv").then(function (data) {
      // Parse the dates and convert the other columns to numbers
      data.forEach(function (datapoints) {
        datapoints.time = d3.timeParse("%Y/%m/%d %H:%M:%S")(datapoints.time);
        datapoints.temperature = +datapoints.temperature;
        datapoints.humidity = +datapoints.humidity;
        datapoints.water = +datapoints.water;
        datapoints.soilmoisture = +datapoints.soilmoisture;
      });

      // Create arrays for the labels and each dataset
      var labels = data.map(function (datapoints) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(datapoints.time); });
      var tempData = data.map(function (datapoints) { return datapoints.temperature; });
      var humidityData = data.map(function (datapoints) { return datapoints.humidity; });
      var waterData = data.map(function (datapoints) { return datapoints.water; });
      var soilData = data.map(function (datapoints) { return datapoints.soilmoisture; });

      // Create chart instances
      var ctxTemp = document.getElementById("temperatureChart").getContext("2d");
      var temperatureChart = createChart(ctxTemp, "Temperature (F)", { labels: labels, values: tempData }, "rgba(153,102,255,0.2)", "rgba(153,102,255,1)", 100);

      var ctxHumidity = document.getElementById("humidityChart").getContext("2d");
      var humidityChart = createChart(ctxHumidity, "Relative Humidity (percent)", { labels: labels, values: humidityData }, "rgba(75,192,192,0.2)", "rgba(75,192,192,1)", 100);

      var ctxWater = document.getElementById("waterChart").getContext("2d");
      var waterChart = createChart(ctxWater, "Water Level (percent)", { labels: labels, values: waterData }, "rgba(2,117,216,0.2)", "rgba(2,117,216,1)", 100);

      var ctxSoil = document.getElementById("soilChart").getContext("2d");
      var soilChart = createChart(ctxSoil, "Soil Moisture (/41)", { labels: labels, values: soilData }, "rgba(255,159,64,0.2)", "rgba(255,159,64,1)", 41);

      // Function to update charts
      var updateChart = function (chart, newData) {
        chart.data.labels = newData.labels;
        chart.data.datasets[0].data = newData.values;
        chart.update();
      };

      // Function to fetch data and update charts
      var fetchDataAndUpdateCharts = function () {
        d3.csv("datalogs.csv").then(function (data) {
          data.forEach(function (datapoints) {
            datapoints.time = d3.timeParse("%Y/%m/%d %H:%M:%S")(datapoints.time);
            datapoints.temperature = +datapoints.temperature;
            datapoints.humidity = +datapoints.humidity;
            datapoints.water = +datapoints.water;
            datapoints.soilmoisture = +datapoints.soilmoisture;
          });

          var labels = data.map(function (datapoints) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(datapoints.time); });
          var tempData = data.map(function (datapoints) { return datapoints.temperature; });
          var humidityData = data.map(function (datapoints) { return datapoints.humidity; });
          var waterData = data.map(function (datapoints) { return datapoints.water; });
          var soilData = data.map(function (datapoints) { return datapoints.soilmoisture; });

          updateChart(temperatureChart, { labels: labels, values: tempData });
          updateChart(humidityChart, { labels: labels, values: humidityData });
          updateChart(waterChart, { labels: labels, values: waterData });
          updateChart(soilChart, { labels: labels, values: soilData });
        });
      };

      // Set interval to update charts
      setInterval(fetchDataAndUpdateCharts, UPDATE_INTERVAL);
    }).catch(function (error) {
      console.log(error);
    });
  });