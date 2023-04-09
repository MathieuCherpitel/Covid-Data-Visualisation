const donut_width = 500;
const donut_height = 500;
const donut_margin = 30;

const donut_svg = d3
  .select("#donut")
  .append("g")
  .attr("transform", `translate(${donut_width / 2}, ${donut_height / 2})`);

const donut_tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip_donut")
  .style("position", "absolute")
  .style("color", "#f8f7f9")
  .style("opacity", 0);

const donut_radius = Math.min(donut_width, donut_height) / 2 - donut_margin;

const donut_color = d3
  .scaleOrdinal()
  .range(["#a6d52e", "#378347", "#78ab82", "#bab3be", "#fcfcfa"]);

function donut() {
  food_production.then((d) => {
    const data = get_major_sources(d);
    const data_ready = get_data_ready(data, d);

    donut_svg
      .selectAll("whatever")
      .data(data_ready)
      .join("path")
      .attr("d", d3.arc().innerRadius(130).outerRadius(donut_radius))
      .attr("fill", function (d) {
        return donut_color(d.data[1]);
      })
      .attr("stroke", "black")
      .attr("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    donut_svg
      .selectAll(".arc")
      .data(data_ready)
      .join("path")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(225)
          .outerRadius(donut_radius + 15)
      )
      .attr("fill", function (d) {
        return donut_color(d.data[1]);
      })
      .attr("stroke", "black")
      .attr("id", function (d) {
        if (d.data[0] == "Feed animals") return "highlight_Feed_animals";
        return "highlight_" + d.data[0];
      })
      .attr("opacity", 0);

    make_legend(data, d);
  });
}

function mouseover(event) {
  const event_data = event.target.__data__;
  const percentage =
    ((event_data.endAngle - event_data.startAngle) / (2 * Math.PI)) * 100;

  const centroid = d3
    .arc()
    .innerRadius(130)
    .outerRadius(donut_radius)
    .centroid(event_data);

  donut_tooltip
    .style("left", centroid[0] + donut_width - 35 + "px")
    .style("top", centroid[1] + donut_height + 125 + "px")
    .transition()
    .duration(200)
    .style("opacity", 1)
    .text(Number(percentage.toFixed(1)) + "%");
  d3.select(this).transition().duration(200).attr("opacity", 0.5);
  let highlight = event.target.__data__.data[0];
  if (highlight == "Feed animals") highlight = "Feed_animals";
  d3.select("#highlight_" + highlight)
    .transition()
    .duration(200)
    .style("opacity", 1);
}

function mouseleave(event) {
  donut_tooltip.transition().duration(200).style("opacity", 0);
  d3.select(this).transition().duration(200).attr("opacity", 0.8);
  let highlight = event.target.__data__.data[0];
  if (highlight == "Feed animals") highlight = "Feed_animals";
  d3.select("#highlight_" + highlight)
    .transition()
    .duration(200)
    .style("opacity", 0);
}

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

function make_legend(data) {
  const legendData = Object.entries(data).map(([source, emission]) => ({
    source,
    emission,
  }));
  const dataWithColor = legendData.map((d) => ({
    ...d,
    color: donut_color(d.source),
  }));
  const legend = donut_svg
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
}

function get_data_ready(data, d) {
  const pie = d3.pie().value(function (d) {
    return d[1];
  });
  return pie(Object.entries(data));
}
