import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, useMap } from 'react-map-gl';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { Pin } from '../../components/Marker';

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

function MapController(props) {
    const { current: map } = useMap();

    useEffect(() => {
        map?.fitBounds(getBounds(props.places));
    }, [props.places]);

    useLayoutEffect(() => {
        var e = document.getElementsByClassName("mapboxgl-map")[0];
        if (e) {
            var ro = new ResizeObserver(() => {
                map.resize()
                map.fitBounds(getBounds(props.places), {
                    padding: {
                        top: 40,
                        bottom: 30,
                        left: 30,
                        right: 30
                    }
                })
            })

            return ro.observe(e),
                function () {
                    ro.unobserve(e)
                }
        }
    }, [])
    return null
}

export default function MapView(props) {
    const pins = useMemo(
        () =>
            props.places.map((place, index) => (
                <Marker
                    key={`marker-${index}`}
                    longitude={place.latlng[1]}
                    latitude={place.latlng[0]}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        // setPopupInfo(place);
                    }}
                >
                    <Pin />
                </Marker>
            )),
        [props.places]
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
            <MapController places={props.places} />
        </Map>
    )
}

