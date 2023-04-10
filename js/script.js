// Loading and cleaning co2_emissions.csv (Used in choropleth.js)
const co2_emissions = d3.csv("../data/co2_emission.csv", function (d) {
  if (parseInt(d["Annual CO₂ emissions (tonnes )"]) > 0)
    return {
      country: d["Entity"],
      year: parseInt(d["Year"]),
      emission: parseInt(d["Annual CO₂ emissions (tonnes )"]),
    };
});

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

// Loading and cleaning food_production.csv (Used in donut.js)
const food_production = d3.csv("../data/food_production.csv", function (d) {
  return {
    Product: d["Food product"],
    Emission: parseFloat(d["Total_emissions"]),
    "Feed animals": parseFloat(d["Animal Feed"]),
    Packaging: parseFloat(d["Packging"]),
    Retail: parseFloat(d["Retail"]),
    Processing: parseFloat(d["Processing"]),
    Transport: parseFloat(d["Transport"]),
  };
});

// Loading hierarchy_co2_emission.json (Used in sunburst.js)
const hierarchy_co2_emission = d3.json("../data/hierarchy_co2_emission.json");

// Section 1
// donut();
sunburst();

// Section 2
// butterfly();

// Section 3
choropleth();
