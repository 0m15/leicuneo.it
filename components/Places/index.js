import Link from "next/link";
import { useCallback, useMemo, useState } from "react"
import { List } from "../Media";
import styles from "./Places.module.css"

function groupBy(array, key) {
    return Object.values(array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {}))
    .map(children => ({ key: children[0][key], distance: children[0]["distance"], slug: children[0]["slug"], name: children[0]["name"], address: children[0]["address"], children }))
    .sort((a,b)=>a.distance-b.distance);
}

export function ListView({ places }) {
    const grouped = useMemo(() => {
        return groupBy(places, "place_id")
    }, [places])

    return (
        <div className="list-view">
            <div className="scroller-y">
                {
                    grouped.map(place => {
                        return (
                            <Link href={`/places/${place.slug}`} className="list-item padding-1" key={place.key}>

                                <div className="flex space-between">
                                    <div>
                                        <div className="text-2 text-700">{place.name}</div>
                                        <div className="text-3">{place.address}</div>
                                    </div>
                                    <div className="text-3">
                                        {place.distance<0.25?(place.distance*1000).toFixed(0)+"m":place.distance+"km"}
                                    </div>
                                </div>

                                <div className="tags-list flex">
                                    {
                                        place.children.map((d, i) => {
                                            return <div key={i} className={"tag tag-circle tag-fill tag-" + d.tag_slug} title={d.tag}></div>
                                        })
                                    }
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

