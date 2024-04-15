// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Load data from CSV file
d3.csv("datalogs.csv").then(function(data) {
  // Parse the dates and convert the other columns to numbers
  data.forEach(function(datapoints) {
    datapoints.time = d3.timeParse("%m/%d/%Y %H:%M:%S")(datapoints.time);
    //datapoints.time = datapoints.time;
    //datapoints.temperature = +datapoints.temperature;
    //datapoints.humidity = +datapoints.humidity;
    datapoints.water = +datapoints.water;
    //datapoints.soilmoisture = +datapoints.soilmoisture;
  });

  // Create arrays for the labels and each dataset
  var labels = data.map(function(datapoints) { return datapoints.time;});
  //var tempData = data.map(function(datapoints) { return datapoints.temperature;});
  //var humidityData = data.map(function(datapoints) { return datapoints.humidity;});
  var waterData = data.map(function(datapoints) { return datapoints.water;});
  //var soilData = data.map(function(datapoints) { return datapoints.soilmoisture;});

// Bar Chart Example
var ctx = document.getElementById("myBarChart");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels.slice(-20).map(function(time) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(time); }),
    datasets: [{
    label: "Water Level",
    lineTension: 0.3,
    backgroundColor: "rgba(2,117,216,0.7)",
    borderColor: "rgba(2,117,216,1)",
    pointRadius: 3,
    pointBackgroundColor: "rgba(2,117,216,1)",
    pointBorderColor: "rgba(255,255,255,0.8)",
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(2,117,216,1)",
    pointHitRadius: 5,
    pointBorderWidth: 2,
    data: waterData.slice(-20), // Only take the last 10 data points
    hidden: false,
    }],
  },
  options: {
    scales: {
    xAxes: [{
      time: {
      unit: 'string',
      //parser: 'DD/MM/YYYY HH:mm'
      },
      gridLines: {
      display: false
      },
      ticks: {
      maxTicksLimit: 20 // Limit the ticks to 10
      }
    }],
    yAxes: [{
      ticks: {
      min: 0,
      max: 10,
      maxTicksLimit: 30
      },
      gridLines: {
      color: "rgba(0, 0, 0, .125)",
      }
    }],
    },
    legend: {
    display: true
    }
  }
  });

}).catch(function(error) {
  console.log(error);
});
