// Loading and cleaning co2_emissions.csv
const co2_emissions = d3.csv("../data/co2_emission.csv", function (d) {
  if (parseInt(d["Annual CO₂ emissions (tonnes )"]) > 0)
    return {
      country: d["Entity"],
      year: parseInt(d["Year"]),
      emission: parseInt(d["Annual CO₂ emissions (tonnes )"]),
    };
});

// Loading and cleaning feed_food.csv
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

// Loading and cleaning food_production.csv
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

// Section 1
donut();
