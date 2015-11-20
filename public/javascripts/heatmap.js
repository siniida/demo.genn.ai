(function(){

  var dataUrl = "http://demo.genn.ai/heatmap/data"
              + location.pathname.substring(location.pathname.lastIndexOf("/"));
  var blockSize = 60;
  var posx = 100, posy = 90;

  var heatmap = null;

  d3.json(dataUrl, function(err, data){
    var color = d3.interpolateRgb("white", "red")
    var maxValue = d3.max(data);

    heatmap = d3.select("#graph")
                .selectAll("rect")
                .data(data);
    heatmap
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return posx + (i % 8) * blockSize;
      })
      .attr("y", function(d, i) {
        return posy + Math.floor(i / 8) * blockSize;
      })
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
      heatmap.data(data)
             .style("fill", function(d, i){
               return color(d / maxValue);
             });
    });
  }, 3000);
})();
