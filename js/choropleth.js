function choropleth() {
  let data = new Map();
  const colorScale = d3
    .scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);

  const tooltip = d3
    .select("#map_section")
    .append("div")
    .attr("class", "map_tooltip")
    .style("position", "absolute")
    .style("opacity", 0);

  Promise.all([
    d3.json("../data/world.json"),
    d3.csv("../data/map_data.csv", function (d) {
      data.set(d.Code, +d.Emissions);
    }),
  ]).then(function (load_data) {
    let topo = load_data[0];
    const width = 1000;
    const height = 1000;
    const sensitivity = 75;

    let projection = d3
      .geoOrthographic()
      .scale(500)
      .center([0, 0])
      .rotate([0, -30])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    let path = d3.geoPath().projection(projection);

    let svg = d3
      .select("#choropleth")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("circle")
      .attr("fill", "lightblue")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", initialScale);

    svg
      .append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      .attr("id", "country")
      .attr("class", (d) => "country_" + d.properties.name.replace(" ", "_"))
      .attr("d", path)
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "white")
      .style("stroke-width", 0.3)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    svg
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", "1")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", initialScale);

    svg.call(
      d3.drag().on("drag", (event) => {
        const rotate = projection.rotate();
        const k = sensitivity / projection.scale();
        projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
        path = d3.geoPath().projection(projection);
        svg.selectAll("path").attr("d", path);
      })
    );

    function mouseover(event) {
      console.log(event);
      d3.selectAll("#country").transition().duration(200).style("opacity", 0.5);
      d3.select(this).transition().duration(200).style("opacity", 1);
      tooltip
        .style("left", event.x + 15 + "px")
        .style("top", event.y - 28 + "px")
        .transition()
        .duration(400)
        .style("opacity", 1)
        .text(
          event.target.__data__.properties.name +
            ": " +
            compact_number(event.target.__data__.total)
        );
    }
    function mouseleave(event) {
      d3.selectAll("#country").transition().duration(200).style("opacity", 0.8);
      d3.select(this).transition().duration(200);
      tooltip.transition().duration(300).style("opacity", 0);
    }

    function compact_number(number) {
      const formatter = Intl.NumberFormat("en", { notation: "compact" });
      return formatter.format(number);
    }
  });
}
