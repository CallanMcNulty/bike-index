function TheftData(displayFunction){
  this.zipCodes = [];
  this.zipCodeTheftNumbers = [];
  this.displayFunction = displayFunction;
}

TheftData.prototype.generateZipCodeArrays = function(pageNumber, displayTheftDataChart){
  var zipCodes = this.zipCodes;
  var zipCodeTheftNumbers = this.zipCodeTheftNumbers;
  var theftDataObject = this;
  var displayFunction = displayTheftDataChart;
  $.get("https://bikeindex.org/api/v2/bikes_search/stolen?page="+ pageNumber + "&per_page=1000&proximity=97209&proximity_square=100").then(function(response, displayFunction) {
    if(response.bikes.length == 0){
      theftDataObject.displayFunction(theftDataObject.zipCodes, theftDataObject.zipCodeTheftNumbers);
      return false;
    }
    console.log("pageNumber = " + pageNumber);
    for(var i=0; i<response.bikes.length; i++) {
      var stolenLocation = response.bikes[i].stolen_location;
      var zipCode = "DEFINED";
      if(stolenLocation.charAt(stolenLocation.length-5) == "-") {
        zipCode = parseInt(stolenLocation.substring(stolenLocation.length-10, stolenLocation.length-5));
      } else {
        zipCode = parseInt(stolenLocation.substring(stolenLocation.length-5));
      }
      if(theftDataObject.zipCodes.indexOf(zipCode) == -1) {
        if(!isNaN(zipCode)) {
          theftDataObject.zipCodes.push(zipCode);
          theftDataObject.zipCodeTheftNumbers.push(1);
        }
      } else {
        theftDataObject.zipCodeTheftNumbers[zipCodes.indexOf(zipCode)] += 1;
      }
    }
    theftDataObject.generateZipCodeArrays(pageNumber+1);
    // console.log(theftDataObject.zipCodes);
    // console.log(theftDataObject.zipCodeTheftNumbers);
  });
};

exports.theftDataModule = TheftData;
