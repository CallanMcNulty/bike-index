function TheftData(cityCode, displayFunction=null){
  this.zipCodes = [];
  this.zipCodeTheftNumbers = [];
  this.displayFunction = displayFunction;
  this.cityCode = cityCode;
}

TheftData.prototype.generateZipCodeArrays = function(pageNumber){
  var theftDataObject = this;
  $.get("https://bikeindex.org/api/v2/bikes_search/stolen?page="+ pageNumber + "&per_page=100&proximity="+this.cityCode+"&proximity_square=10").then(function(response, displayFunction) {
    if(response.bikes.length === 0){
      theftDataObject.displayFunction(theftDataObject.zipCodes, theftDataObject.zipCodeTheftNumbers);
      return false;
    }
    console.log("pageNumber = " + pageNumber);
    for(var i=0; i<response.bikes.length; i++) {
      var stolenLocation = response.bikes[i].stolen_location;
      var zipCode = "";
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
        theftDataObject.zipCodeTheftNumbers[theftDataObject.zipCodes.indexOf(zipCode)] += 1;
      }
    }
    theftDataObject.generateZipCodeArrays(pageNumber+1);
  });
};

exports.theftDataModule = TheftData;
