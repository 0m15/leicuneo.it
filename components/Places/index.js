import { useCallback, useMemo, useState } from "react"
import { List } from "../Media";
import styles from "./Places.module.css"

function groupBy(array, key) {
    return Object.values(array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {})).map(children => ({ key: children[0][key], name: children[0]["name"], address: children[0]["address"], children }));
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
                            <div className="list-item" key={place.key}>
                                <div className="text-1">{place.name}</div>
                                <div className="text-2">{place.address}</div>
                                <div className="tags-list">
                                    {
                                        place.children.map((d, i) => {
                                            return <div key={i} className={"tag-dot " + d.media_type}>{d.media_type}</div>
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

