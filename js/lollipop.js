function strip(data) {
  data.forEach((object) => {
    const split_item = object.item
      .split("-")[0]
      .split("and")[0]
      .split("(")[0]
      .trim();
    if (split_item !== object.item) {
      object.item = split_item;
    }
  });
  return data;
}

function remove_dup(data) {
  const uniqueValues = new Set();
  return data.filter((obj) => {
    if (!uniqueValues.has(obj.item)) {
      uniqueValues.add(obj.item);
      return true;
    }
    return false;
  });
}

function get_lollipop_data(data, country) {
  data = data.filter((obj) => obj.country === country);
  data = [...new Set(data)];
  data = remove_dup(data);
  data = data.sort((a, b) => b.volume - a.volume).slice(0, 10);
  data = data.map((obj) => ({ volume: obj.volume, item: obj.item }));
  data = strip(data);
  return data;
}

const margin = { top: 200, right: 30, bottom: 80, left: 100 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("#lollipop")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleBand().range([0, width]).padding(1);
const xAxis = svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .style("color", "white");

const y = d3.scaleLinear().range([height, 0]);
const yAxis = svg.append("g").attr("class", "myYaxis").style("color", "white");

function lollipop() {
  feed_food.then((data) => {
    let selected_data = get_lollipop_data(data, selected_country);

    update(selected_data);
  });
}

function update(data) {
  x.domain(
    data.map(function (d) {
      return d.item;
    })
  );
  xAxis
    .transition()
    .duration(1000)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("color", "white");

  // Add Y axis
  y.domain([
    0,
    d3.max(data, function (d) {
      return parseFloat(d.volume);
    }),
  ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

  const j = svg.selectAll(".myLine").data(data);
  // update lines
  j.join("line")
    .attr("class", "myLine")
    .transition()
    .duration(1000)
    .attr("x1", function (d) {
      return x(d.item);
    })
    .attr("x2", function (d) {
      return x(d.item);
    })
    .attr("y1", y(0))
    .attr("y2", function (d) {
      return y(d.volume);
    })
    .attr("stroke", "white");

  const u = svg.selectAll("circle").data(data);
  u.join("circle")
    .transition()
    .duration(1000)
    .attr("cx", function (d) {
      return x(d.item);
    })
    .attr("cy", function (d) {
      return y(d.volume);
    })
    .attr("r", 8)
    .attr("fill", "#69b3a2");
}
