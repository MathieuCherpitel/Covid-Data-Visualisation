function pause_rotation() {
  rotation = 0;
}
function unpause_rotation() {
  rotation = 20;
}

var rotation = 20;

function sunburst() {
  hierarchy_co2_emission.then((data) => {
    const width = 800;
    const height = 800;
    const radius = height / 2;
    const svg = d3
      .select("#sunburst")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain([
        "Feed animals",
        "Packaging",
        "Processing",
        "Retail",
        "Transport",
      ])
      .range(["#a6d52e", "#378347", "#78ab82", "#bab3be", "#fcfcfa"]);

    arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(1 / radius)
      .padRadius(radius)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius((d) => Math.sqrt(d.y1) - 1);

    partition = (data) =>
      d3.partition().size([2 * Math.PI, radius * radius])(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );

    const root = partition(data);

    const default_label = svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class", "default label")
      .attr("fill", "#888")
      .attr("font-size", "3em")
      .text("Hover me !");

    const label = svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#888")
      .style("visibility", "hidden");

    label
      .append("tspan")
      .attr("class", "percentage")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "-0.1em")
      .attr("font-size", "3em")
      .text("");

    label
      .append("tspan")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "1.5em")
      .text("of CO2 emissions");

    label
      .append("tspan")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "3em")
      .attr("class", "sequence")
      .attr("font-size", "2em");

    const path = svg
      .append("g")
      .selectAll("path")
      .data(
        root.descendants().filter((d) => {
          return d.depth;
        })
      )
      .join("path")
      .attr("fill", (d) => color(d.data.name))
      .attr("d", arc);

    mousearc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius(radius);

    svg
      .append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseleave", () => {
        path.attr("fill-opacity", 1);
        label.style("visibility", "hidden");
        default_label.style("visibility", "visible");
      })
      .selectAll("path")
      .data(
        root.descendants().filter((d) => {
          return d.depth;
        })
      )
      .join("path")
      .attr("d", mousearc)
      .on("mouseenter", (event, d) => {
        default_label.style("visibility", "hidden");
        const sequence = d.ancestors().reverse().slice(1);
        path.attr("fill-opacity", (node) =>
          sequence.indexOf(node) >= 0 ? 1.0 : 0.3
        );
        const percentage = ((100 * d.value) / root.value).toPrecision(3);
        label
          .style("visibility", null)
          .select(".percentage")
          .text(percentage + "%");
        let sequence_text = sequence[0].data.name;
        if (sequence.length > 1) {
          let sep = " ";
          if (sequence_text == "Feed animals") sep += "for ";
          else sep += "of ";
          sequence_text += sep + sequence[1].data.name;
        }
        d3.select(".sequence").text(sequence_text);
      });
  });
}
