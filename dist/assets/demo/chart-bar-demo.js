// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Function to create a bar chart
function createBarChart(ctx, labels, data) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Water Level (percent)",
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
        data: data,
        hidden: false,
      }],
    },
    options: {
      scales: {
        xAxes: [{
          time: {
            unit: 'string',
          },
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 20
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            maxTicksLimit: 20
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
}

// Read configuration file
fetch('config.json')
  .then(response => response.json())
  .then(config => {
    const UPDATE_INTERVAL = config.updateInterval;

    // Load initial data from CSV file and create bar chart
    d3.csv("datalogs.csv").then(function (data) {
      data.forEach(function (datapoints) {
        datapoints.time = d3.timeParse("%Y/%m/%d %H:%M:%S")(datapoints.time);
        datapoints.water = +datapoints.water;
      });

      var labels = data.map(function (datapoints) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(datapoints.time); });
      var waterData = data.map(function (datapoints) { return datapoints.water; });

      var ctx = document.getElementById("myBarChart").getContext("2d");
      var myBarChart = createBarChart(ctx, labels.slice(-20), waterData.slice(-20));

      // Function to update bar chart
      var updateBarChart = function (chart, labels, data) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
      };

      // Function to fetch data and update bar chart
      var fetchDataAndUpdateBarChart = function () {
        d3.csv("datalogs.csv").then(function (data) {
          data.forEach(function (datapoints) {
            datapoints.time = d3.timeParse("%Y/%m/%d %H:%M:%S")(datapoints.time);
            datapoints.water = +datapoints.water;
          });

          var labels = data.map(function (datapoints) { return d3.timeFormat("%m/%d/%Y %H:%M:%S")(datapoints.time); });
          var waterData = data.map(function (datapoints) { return datapoints.water; });

          updateBarChart(myBarChart, labels.slice(-20), waterData.slice(-20));
        });
      };

      // Set interval to update bar chart
      setInterval(fetchDataAndUpdateBarChart, UPDATE_INTERVAL);
    }).catch(function (error) {
      console.log(error);
    });
  });