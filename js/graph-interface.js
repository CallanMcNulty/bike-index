var Chart = require('./../node_modules/chart.js/src/chart.js');
var TheftData = require('./../js/TheftData.js').theftDataModule;
var mapsApiKey = require('./../.env');

var findZip = function(startIndex, zipCodes) {
  if(zipCodes[startIndex]) {
    $("#zip-code").append('<option id="'+zipCodes[startIndex]+'" value="'+zipCodes[startIndex]+'">'+zipCodes[startIndex]+'</option>');
    $('#'+zipCodes[startIndex]).attr('selected', 'selected');
    $("#zip-code").trigger("change");
    console.log($('#zip-code').val());
    $('.zip-readout').text(zipCodes[startIndex]);
  } else {
    return;
  }
  setTimeout(function(){
    findZip(startIndex+1, zipCodes);
  }, 1000);
}

var displayTheftDataChart = function(zipCodes, zipCodeTheftNumbers) {
  var cty = $('#chart-numbers-by-zip');
  var myChart = new Chart(cty, {
    type: 'bar',
    data: {
      labels: zipCodes,
      datasets: [{
        label: '# of Thefts',
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
  findZip(0,zipCodes);
};
$(document).ready(function() {
  $(".graph-display-button").click(function() {
    
  });
});
