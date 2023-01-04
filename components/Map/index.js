import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, Popup, useControl, useMap } from 'react-map-gl';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Pin } from '../../components/Marker';
import { useGeolocation } from 'react-use';
import { location, state } from '../../store';
import { useSnapshot } from 'valtio';
import { groupBy } from '../../utils';
import Link from 'next/link';

const MAPBOX_TOKEN = "pk.eyJ1IjoiYXVyb3JhbWVjY2FuaWNhIiwiYSI6ImNsMnN3NWU5ZzAydTkzY2xydG8xdzB2dXEifQ.CUgsrj8QK3zSeDdUejuwmw"

function getBounds(points) {
    const minLat = Math.min(...points.map(d => d.latlng[0]))
    const maxLat = Math.max(...points.map(d => d.latlng[0]))
    const minLng = Math.min(...points.map(d => d.latlng[1]))
    const maxLng = Math.max(...points.map(d => d.latlng[1]))

    return [
        [minLng, minLat],
        [maxLng, maxLat]
    ]
}

const fitBoundsOptions = {
    padding: {
        top: 50,
        bottom: 20,
        left: 30,
        right: 30
    }
}

function MapController(props) {
    const { current: map } = useMap();

    useEffect(() => {
        map?.fitBounds(getBounds(props.places), fitBoundsOptions);
    }, [props.places]);

    useLayoutEffect(() => {
        var e = document.getElementsByClassName("mapboxgl-map")[0];
        if (e) {
            var ro = new ResizeObserver(() => {
                map.resize()
                map.fitBounds(getBounds(props.places), fitBoundsOptions)
            })

            return ro.observe(e),
                function () {
                    ro.unobserve(e)
                }
        }
    }, [])
    return null
}

function Geolocation() {

    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            const crd = pos.coords;

            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);

            location.latitude = crd.latitude
            location.longitude = crd.longitude
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    }, [])

    return null
}

function GeolocationButton({
}) {
    const snap = useSnapshot(state)
    const fill = snap.centerUserLocation ? "blue" : "#222"

    const onClick = useCallback(() => {
        state.centerUserLocation = !state.centerUserLocation
    }, [])

    return (
        <button onClick={onClick} className='button button-circle button-ghost bg-white' style={{ width: 46, height: 46, padding: 0, }}>
            <svg viewBox="0 0 91 91" width={42} height={42}>
                <circle cx="45.5" cy="45.5" r="8" style={{ fill }}></circle>
                <path style={{ fill }} d="M72.18 41.68H68A22.82 22.82 0 0 0 49.31 23v-4.2a3.82 3.82 0 0 0-7.63 0V23A22.8 22.8 0 0 0 23 41.68h-4.2a3.82 3.82 0 0 0 0 7.63H23A22.82 22.82 0 0 0 41.68 68v4.19a3.82 3.82 0 1 0 7.63 0V68A22.85 22.85 0 0 0 68 49.31h4.19a3.82 3.82 0 0 0 0-7.63ZM45.5 60.74a15.26 15.26 0 1 1 10.78-4.47 15.26 15.26 0 0 1-10.78 4.47Z"></path>
            </svg>
            {snap.centerUserLocation && <Geolocation />}
        </button>
    )
}

export default function MapView(props) {
    const grouped = useMemo(() => {
        return groupBy(props.places, "place_id")
    }, [props.places])

    const [popup, setPopupInfo] = useState(null)

    const pins = useMemo(
        () => {
            if (!grouped) return []

            return grouped.map((place, index) => (
                <Marker
                    key={`marker-${index}`}
                    longitude={place.latlng[1]}
                    latitude={place.latlng[0]}
                    anchor="bottom"
                    
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setPopupInfo(place);
                    }}
                >
                    <Pin
                    isActive={popup===place}
                        id={place.place_id}
                        tags={[place, ...place.children]}
                    />
                </Marker>
            ))
        },
        [grouped, popup]
    );

    return (
        <Map
            initialViewState={{
                longitude: 7.547580198768703,
                latitude: 44.3911307563075,
                zoom: 14,
            }}
            mapStyle="mapbox://styles/aurorameccanica/cl2vxk6x5000k15qbny484dyp"
            maxBounds={[[7.418341, 44.2656232], [7.6759931, 44.5041265]]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            {pins}

            {popup &&
                <Popup
                    anchor="top"
                    longitude={Number(popup.latlng[1])}
                    latitude={Number(popup.latlng[0])}
                    onClose={() => setPopupInfo(null)}
                >
                    <Link href={`/places/${popup.slug}`}>
                        <div className='text-2 text-700' style={{ fontFamily: "Besley", lineHeight: 1 }}>
                            {popup.name}
                        </div>
                        <div className='text-3 text-500' style={{ fontFamily: "Besley" }}>
                            {popup.address}
                        </div>
                        <div className="tags-list flex">
                            {
                                popup.children.map((d, i) => {
                                    return <div key={i} className={"tag tag-circle tag-fill tag-" + d.tag_slug} title={d.tag}></div>
                                })
                            }
                        </div>
                    </Link>
                </Popup>
            }
            <MapController places={props.places} />
            <div style={{ position: "absolute", bottom: "3rem", right: "1.75rem", zIndex: 100, width: "30px" }}>
                <GeolocationButton />
            </div>
        </Map>
    )
}

