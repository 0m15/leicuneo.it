export function toSlug(name) {
    // Replace spaces with hyphens
    let slug = name.replace(/\s+/g, '-');

    // Convert to lowercase
    slug = slug.toLowerCase();

    // Remove non-word characters
    slug = slug.replace(/[^\w-]+/g, '');

    return slug;
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
export function calcDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    if(d<=1) {
        return d.toFixed(2)
    }

    return d < 10 ? d.toFixed(2) : d.toFixed(1);
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}