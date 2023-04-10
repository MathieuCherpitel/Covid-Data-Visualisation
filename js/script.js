// Loading and cleaning feed_food.csv (Used in butterfly.js)
const feed_food = d3.csv("../data/feed_food.csv", function (d) {
  if (parseInt(d["Y2013"]) > 0 && d["Element"] == "Food") {
    return {
      country: d["Area"],
      country_ab: d["Area Abbreviation"],
      item: d["Item"],
      volume: d["Y2013"],
    };
  }
});

// Loading hierarchy_co2_emission.json (Used in sunburst.js)
const hierarchy_co2_emission = d3.json("../data/hierarchy_co2_emission.json");

// Section 2
selected_country = "England";
sunburst();
lollipop();

// Section 3
choropleth();
