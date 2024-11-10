// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Load data from CSV file
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
  var labels = data.map(function (datapoints) { return datapoints.time; });
  var tempData = data.map(function (datapoints) { return datapoints.temperature; });
  var humidityData = data.map(function (datapoints) { return datapoints.humidity; });
  var waterData = data.map(function (datapoints) { return datapoints.water; });
  var soilData = data.map(function (datapoints) { return datapoints.soilmoisture; });

  // Create temperature chart
  var ctxTemp = document.getElementById("temperatureChart").getContext("2d");
  new Chart(ctxTemp, {
    type: 'line',
    data: {
      labels: labels.map(function (time) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(time); }),
      datasets: [{
        label: "Temperature (C)",
        lineTension: 0.3,
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(153,102,255,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(153,102,255,1)",
        pointHitRadius: 5,
        pointBorderWidth: 2,
        data: tempData,
        hidden: false,
      }]
    }
  });

  // Create humidity chart
  var ctxHumidity = document.getElementById("humidityChart").getContext("2d");
  new Chart(ctxHumidity, {
    type: 'line',
    data: {
      labels: labels.map(function (time) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(time); }),
      datasets: [{
        label: "Relative Humidity (percentage)",
        lineTension: 0.3,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(75,192,192,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHitRadius: 5,
        pointBorderWidth: 2,
        data: humidityData,
        hidden: false,
      }]
    }
  });

  // Create water chart
  var ctxWater = document.getElementById("waterChart").getContext("2d");
  new Chart(ctxWater, {
    type: 'line',
    data: {
      labels: labels.map(function (time) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(time); }),
      datasets: [{
        label: "Water Level (inches)",
        lineTension: 0.3,
        backgroundColor: "rgba(2,117,216,0.2)",
        borderColor: "rgba(2,117,216,1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(2,117,216,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(2,117,216,1)",
        pointHitRadius: 5,
        pointBorderWidth: 2,
        data: waterData,
        hidden: false,
      }]
    }
  });

  // Create soil moisture chart
  var ctxSoil = document.getElementById("soilChart").getContext("2d");
  new Chart(ctxSoil, {
    type: 'line',
    data: {
      labels: labels.map(function (time) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(time); }),
      datasets: [{
        label: "Soil Moisture (/30)",
        lineTension: 0.3,
        backgroundColor: "rgba(255,159,64,0.2)",
        borderColor: "rgba(255,159,64,1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(255,159,64,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(255,159,64,1)",
        pointHitRadius: 5,
        pointBorderWidth: 2,
        data: soilData,
        hidden: false,
      }]
    }
  });
});