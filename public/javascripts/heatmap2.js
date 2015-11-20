(function(){

  var dataUrl = "http://demo.genn.ai/heatmap/data"
              + location.pathname.substring(location.pathname.lastIndexOf("/"));
  var blockSize = 60;
  var posx = 130, posy = 120;

  var heatmap = null;

  d3.json(dataUrl, function(err, data){
    var color = d3.interpolateRgb("white", "red")
    var maxValue = d3.max(data);

//    console.log(data);

    heatmap = d3.select("#graph")
                .selectAll("circle")
                .data(data);
    heatmap
      .enter()
      .append("circle")
      .attr("cx", function(d, i) {
        return posx + (i % 8) * blockSize;
      })
      .attr("cy", function(d, i) {
        return posy + Math.floor(i / 8) * blockSize;
      })
      .attr("r", 30)
      .attr("width", blockSize)
      .attr("height", blockSize)
      .style("fill", function(d, i) {
        return color(d / maxValue)
      })
      .style("opacity", "0.7")
      .style("stroke", "black");
  });

  setInterval(function(){
    d3.json(dataUrl, function(err, data){
      var color = d3.interpolateRgb("white", "red")
      var maxValue = d3.max(data);
//      console.log(data);
      heatmap.data(data)
             .style("fill", function(d, i){
               return color(d / maxValue);
             });
    });
  }, 3000);
})();
