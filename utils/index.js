export function toSlug(name) {
  // Replace spaces with hyphens
  let slug = name.replace(/\s+/g, "-");

  // Convert to lowercase
  slug = slug.toLowerCase();

  // Remove non-word characters
  slug = slug.replace(/[^\w-]+/g, "");

  return slug;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
export function calcDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km

  return d.toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function groupBy(array, key) {
  return Object.values(
    array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {})
  )
    .map((children) => ({ ...children[0], children }))
    .sort((a, b) => a.distance - b.distance);
}
