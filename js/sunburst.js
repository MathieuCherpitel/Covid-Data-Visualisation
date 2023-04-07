function get_major_sources(data) {
  const sources = [
    "Feed animals",
    "Packaging",
    "Processing",
    "Retail",
    "Transport",
  ];
  const result = sources.reduce((acc, source) => {
    const emission = data.reduce((total, item) => total + item[source], 0);
    return { ...acc, [source]: emission };
  }, {});
  return result;
}

function donut() {
  food_production.then((d) => {
    const data = get_major_sources(d);
    console.log(data);
    const width = 500,
      height = 500,
      margin = 0;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select("#donut")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    const color = d3
      .scaleOrdinal()
      .range(["#a6d52e", "#378347", "#78ab82", "#bab3be", "#fcfcfa"]);
    const pie = d3.pie().value(function (d) {
      return d[1];
    });
    const dataReady = pie(Object.entries(data));
    svg
      .selectAll("whatever")
      .data(dataReady)
      .join("path")
      .attr("d", d3.arc().innerRadius(130).outerRadius(radius))
      .attr("fill", function (d) {
        return color(d.data[1]);
      })
      .attr("stroke", "black")
      .attr("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);
    const legendData = Object.entries(data).map(([source, emission]) => ({
      source,
      emission,
    }));
    const dataWithColor = legendData.map((d) => ({
      ...d,
      color: color(d.source),
    }));

    const legend = svg
      .selectAll(null)
      .data(dataWithColor)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(-40,${i * 25 - 50})`);

    legend
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", (d) => d.color);

    legend
      .append("text")
      .text((d) => d.source)
      .style("fill", "white")
      .attr("x", 25)
      .attr("y", 15);
  });
}

function mouseover(event) {
  d3.select(this).transition().duration(200).attr("opacity", 0.5);
}

function mouseleave(event) {
  d3.select(this).transition().duration(200).attr("opacity", 0.8);
}
