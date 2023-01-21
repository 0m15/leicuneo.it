import Link from "next/link";
import { useMemo } from "react";
import { groupBy } from "../../utils";

export function ListView({ places }) {
  const grouped = useMemo(() => {
    return groupBy(places, "place_id");
  }, [places]);

  return (
    <div className="list-view">
      <div className="scroller-y">
        {grouped.map((place, i) => {
          return (
            <Link
              href={`/places/${place.slug}`}
              className="list-item padding-1"
              key={i}
            >
              <div className="flex space-between">
                <div>
                  <div className="text-2 text-700">{place.name}</div>
                  <div className="text-3">{place.address}</div>
                </div>
                {place.distance !== undefined && (
                  <div className="text-3">
                    {place.distance}km
                    {/* {place.distance < 0.25
                      ? (place.distance * 1000).toFixed(0) + "m"
                      : place.distance + "km"} */}
                  </div>
                )}
              </div>

              <div className="tags-list flex">
                {place.children.map((d, i) => {
                  return (
                    <div
                      key={i}
                      className={"tag tag-circle tag-fill tag-" + d.tag_slug}
                      title={d.tag}
                    ></div>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
