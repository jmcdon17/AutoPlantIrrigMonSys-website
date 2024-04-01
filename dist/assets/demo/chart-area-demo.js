// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Load data from CSV file
d3.csv("datalogs.csv").then(function(data) {
  // Parse the dates and convert the other columns to numbers
  data.forEach(function(datapoints) {
    datapoints.time = d3.timeParse("%m/%d/%Y %H:%M")(datapoints.time);
    datapoints.temperature = +datapoints.temperature;
    datapoints.humidity = +datapoints.humidity;
    //datapoints.water = +datapoints.water;
    datapoints.soilmoisture = +datapoints.soilmoisture;
  });

  // Create arrays for the labels and each dataset
  var labels = data.map(function(datapoints) { return datapoints.time;});
  var tempData = data.map(function(datapoints) { return datapoints.temperature;});
  var humidityData = data.map(function(datapoints) { return datapoints.humidity;});
  //var waterData = data.map(function(datapoints) { return datapoints.water;});
  var soilData = data.map(function(datapoints) { return datapoints.soilmoisture;});

  // Create Multi-line Chart
  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: "Temperature",
        lineTension: 0.3,
        backgroundColor: "rgba(2,117,216,0.2)",
        borderColor: "rgba(2,117,216,1)",
        pointRadius: 0,
        pointBackgroundColor: "rgba(2,117,216,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(2,117,216,1)",
        pointHitRadius: 5,
        pointBorderWidth: 2,
        data: tempData,
        hidden: false,
      },
      {
        label: "Relative Humidity",
        lineTension: 0.3,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        pointRadius: 0,
        pointBackgroundColor: "rgba(75,192,192,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHitRadius: 5,
        pointBorderWidth: 2,
        data: humidityData,
        hidden: false,
      },
      {
        label: "Soil Moisture",
        lineTension: 0.3,
        backgroundColor: "rgba(255,159,64,0.2)",
        borderColor: "rgba(255,159,64,1)",
        pointRadius: 0,
        pointBackgroundColor: "rgba(255,159,64,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(255,159,64,1)",
        pointHitRadius: 5,
        pointBorderWidth: 2,
        data: soilData,
        hidden: false,
      }],
    },
    options: {
      scales: {
        xAxes: [{
          time: {
            unit: 'date',
            //parser: 'DD/MM/YYYY HH:mm'
          },
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            maxTicksLimit: 5
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
// // Multi Line Chart Example
// var ctx = document.getElementById("myAreaChart");
// var myLineChart = new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13"],
//     datasets: [{
//       label: "Temperature",
//       lineTension: 0.3,
//       backgroundColor: "rgba(2,117,216,0.2)",
//       borderColor: "rgba(2,117,216,1)",
//       pointRadius: 5,
//       pointBackgroundColor: "rgba(2,117,216,1)",
//       pointBorderColor: "rgba(255,255,255,0.8)",
//       pointHoverRadius: 5,
//       pointHoverBackgroundColor: "rgba(2,117,216,1)",
//       pointHitRadius: 50,
//       pointBorderWidth: 2,
//       data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
//       hidden: false,
//     },
//     {
//       label: "Relative Humidity",
//       lineTension: 0.3,
//       backgroundColor: "rgba(75,192,192,0.2)",
//       borderColor: "rgba(75,192,192,1)",
//       pointRadius: 5,
//       pointBackgroundColor: "rgba(75,192,192,1)",
//       pointBorderColor: "rgba(255,255,255,0.8)",
//       pointHoverRadius: 5,
//       pointHoverBackgroundColor: "rgba(75,192,192,1)",
//       pointHitRadius: 50,
//       pointBorderWidth: 2,
//       data: [15000, 21162, 20263, 24394, 15287, 19682, 21274, 23259, 18849, 15159, 11651, 17984, 19451],
//       hidden: false,
//     },
//     {
//       label: "Water Level",
//       lineTension: 0.3,
//       backgroundColor: "rgba(153,102,255,0.2)",
//       borderColor: "rgba(153,102,255,1)",
//       pointRadius: 5,
//       pointBackgroundColor: "rgba(153,102,255,1)",
//       pointBorderColor: "rgba(255,255,255,0.8)",
//       pointHoverRadius: 5,
//       pointHoverBackgroundColor: "rgba(153,102,255,1)",
//       pointHitRadius: 50,
//       pointBorderWidth: 2,
//       data: [20000, 27162, 22263, 20394, 17287, 20682, 21274, 23259, 23849, 22159, 22651, 29984, 20451],
//       hidden: false,
//     },
//     {
//       label: "Soil Moisture",
//       lineTension: 0.3,
//       backgroundColor: "rgba(255,159,64,0.2)",
//       borderColor: "rgba(255,159,64,1)",
//       pointRadius: 5,
//       pointBackgroundColor: "rgba(255,159,64,1)",
//       pointBorderColor: "rgba(255,255,255,0.8)",
//       pointHoverRadius: 5,
//       pointHoverBackgroundColor: "rgba(255,159,64,1)",
//       pointHitRadius: 50,
//       pointBorderWidth: 2,
//       data: [25000, 22162, 24263, 22394, 19287, 21682, 22274, 24259, 25849, 27159, 28651, 29984, 32451],
//       hidden: false,
//     }],
//   },
//   options: {
//     scales: {
//       xAxes: [{
//         time: {
//           unit: 'date'
//         },
//         gridLines: {
//           display: false
//         },
//         ticks: {
//           maxTicksLimit: 7
//         }
//       }],
//       yAxes: [{
//         ticks: {
//           min: 0,
//           max: 40000,
//           maxTicksLimit: 5
//         },
//         gridLines: {
//           color: "rgba(0, 0, 0, .125)",
//         }
//       }],
//     },
//     legend: {
//       display: true
//     }
//   }
// });
