var Chart = require('./../node_modules/chart.js/src/chart.js');

$(document).ready(function() {
  $(".graph-display-button").click(function() {
    var zipCodes = [];
    var zipCodeTheftNumbers = [];
    $.get("https://bikeindex.org/api/v2/bikes_search/stolen?per_page=30000&proximity=97209&proximity_square=25").then(function(response) {
      console.log(response);
      for(var i=0; i<response.bikes.length; i++) {
        var stolenLocation = response.bikes[i].stolen_location;
        var zipCode;
        if(stolenLocation.charAt(stolenLocation.length-5) == "-") {
          zipCode = parseInt(stolenLocation.substring(stolenLocation.length-10, stolenLocation.length-5));
        } else {
          zipCode = parseInt(stolenLocation.substring(stolenLocation.length-5));
        }
        if(zipCodes.indexOf(zipCode) == -1) {
          if(!isNaN(zipCode)) {
            zipCodes.push(zipCode);
            zipCodeTheftNumbers.push(1);
          }
        } else {
          zipCodeTheftNumbers[zipCodes.indexOf(zipCode)] += 1;
        }
      }
      console.log(zipCodes);
      console.log(zipCodeTheftNumbers);
      var cty = $('#chart-numbers-by-zip');
      var myChart = new Chart(cty, {
        type: 'bar',
        data: {
          labels: zipCodes,
          datasets: [{
            label: '# of Votes',
            data: zipCodeTheftNumbers,

            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }]
          }
        }
      });
    });
    var ctx = $('#chart-js-hello');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });

  });
});
