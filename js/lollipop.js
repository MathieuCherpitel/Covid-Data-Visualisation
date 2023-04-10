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

function get_lollipop_data(country) {
  feed_food.then((data) => {
    data = data.filter((obj) => obj.country === country);
    data = [...new Set(data)];
    data = remove_dup(data);
    data = data.sort((a, b) => b.volume - a.volume).slice(0, 10);
    data = data.map((obj) => ({ volume: obj.volume, item: obj.item }));
    console.log(data);
    return data;
  });
}

function lollipop() {
  feed_food.then((data) => {
    data = get_lollipop_data(selected_country);
  });
}
