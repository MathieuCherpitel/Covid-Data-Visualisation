function sunburst() {
  food_production.then((d) => {
    console.log(d);
  });
}

var data = {
  name: "Feed animals",
  value: 19.5,
  childrens: [
    {
      name: "Beef (beef herd)",
      value: 1.9,
    },
    {
      name: "Beef (dairy herd)",
      value: 2.5,
    },
    {
      name: "Lamb & Mutton",
      value: 2.4,
    },
  ],
};
