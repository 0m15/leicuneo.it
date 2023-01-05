import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { ListView as ContentsListView } from "../components/Contents";
import MapView from "../components/Map";
import { Navbar } from "../components/Navbar";
import { ListView } from "../components/Places";
import { location, state, tagsSelection } from "../store";
import { calcDistance, toSlug } from "../utils";
import data from "../data.json";
import { useMemoOne } from "@react-spring/shared";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYXVyb3JhbWVjY2FuaWNhIiwiYSI6ImNsMnN3NWU5ZzAydTkzY2xydG8xdzB2dXEifQ.CUgsrj8QK3zSeDdUejuwmw";

export async function getStaticProps({ query }) {
  const places = data
    .filter((d) => d.latlng?.trim().length > 0)
    .map((d) => {
      let latlng = d.latlng.split(",").map((d) => parseFloat(d));

      return {
        ...d,
        tag_slug: toSlug(d.tag),
        slug: toSlug(d.name),
        latlng,
      };
    });

  return {
    props: {
      places,
    },
  };
}

function Tags({ places, all, onSelectionChanged = (selectedTag) => {} }) {
  const selected = useSnapshot(tagsSelection);

  const uniqueTags = useMemoOne(() => {
    return [
      ...new Set(all.filter((d) => d.tag?.trim().length > 0).map((d) => d.tag)),
    ];
  }, []);

  const uniqueSubtags = useMemoOne(() => {
    return [
      ...new Set(
        all.filter((d) => d.subtag?.trim().length > 0).map((d) => d.subtag)
      ),
    ];
  }, []);

  const uniqueTagsId = useMemoOne(() => {
    return [
      ...new Set(
        all.filter((d) => d.tag_slug?.trim().length > 0).map((d) => d.tag_slug)
      ),
    ];
  }, []);

  const onClickTag = useCallback(
    (t) => () => {
      tagsSelection.tag = t === tagsSelection.tag ? null : t;
      (tagsSelection.subtag =
        t !== "La valigia del Migrante" ? null : tagsSelection.subtag),
        onSelectionChanged(tagsSelection);
    },
    []
  );

  const onClickSubtag = useCallback(
    (t) => () => {
      (tagsSelection.subtag = tagsSelection.subtag === t ? null : t),
        onSelectionChanged(tagsSelection);
    },
    []
  );

  return (
    <>
      <div className="padding-1 button-list">
        {uniqueTags.map((d, i) => {
          return (
            <button
              className={`button button-2 button-tag tag-${uniqueTagsId[i]} ${
                d == selected.tag ? "button-active" : ""
              }`}
              onClick={onClickTag(d)}
              key={d}
            >
              {d}
            </button>
          );
        })}

        {selected.tag === "La Valigia del Migrante" && (
          <div>
            {uniqueSubtags.map((d, i) => {
              return (
                <button
                  className={`button subtag button-subtag button-2 ${
                    d == selected.subtag ? "button-active" : ""
                  }`}
                  onClick={onClickSubtag(d)}
                  key={d}
                >
                  {d}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="pl-1">
        <div className="text-700">
          {places.length > 1 && places.length + " risultati"}
          {places.length === 1 && "1 risultato"}
          {places.length === 0 && "nessun risultato"}
        </div>
        {/* <div className='text-em'>
          {places[0].description}
        </div> */}
      </div>
      <ContentsListView contents={places} />
    </>
  );
}

function MainContent({ all }) {
  const [filtered, setFiltered] = useState([...all]);
  const ui = useSnapshot(state);
  const tags = useSnapshot(tagsSelection);

  const onClickTab = useCallback(
    (tabId) => () => {
      state.tab = tabId;
    },
    []
  );

  useEffect(() => {
    if (tags.tag === null) {
      setFiltered([...all]);
      return;
    }

    let filtered = all.filter((d) => d.tag == tags.tag);

    if (tags.subtag) {
      filtered = filtered.filter((d) => d.subtag == tags.subtag);
    }

    setFiltered(filtered);
  }, [all, tags]);

  return (
    <>
      <div style={{ height: "auto", flex: 1, position: "relative" }}>
        <MapView places={filtered} all={all} />
      </div>
      {ui.showContentsPopover && (
        <div className="flex flex-column" style={{ height: "50%", zIndex: 1 }}>
          <div className="flex flex-center button-list padding-1 separator">
            <button
              className={
                "button button-ghost " + (ui.tab == 0 ? "button-active" : "")
              }
              onClick={onClickTab(0)}
            >
              Tutti i luoghi
            </button>
            <button
              className={
                "button button-ghost " + (ui.tab == 1 ? "button-active" : "")
              }
              onClick={onClickTab(1)}
            >
              Contenuti
            </button>
          </div>
          <>
            {ui.tab == 0 && <ListView places={all} />}
            {ui.tab == 1 && <Tags places={filtered} all={all} />}
          </>
        </div>
      )}
    </>
  );
}

export default function Index(props) {
  const [all, setAll] = useState([...props.places]);
  const locationState = useSnapshot(location);

  useEffect(() => {
    if (locationState.latitude == null || locationState.longitude == null)
      return;

    setAll((cur) => {
      return cur.map((d, i) => {
        return {
          ...d,
          distance: calcDistance(
            locationState.latitude,
            locationState.longitude,
            d.latlng[0],
            d.latlng[1]
          ),
        };
      });
    });
  }, [locationState.latitude, locationState.longitude]);

  return (
    <div className="flex-column" style={{ height: "100%" }}>
      <Navbar />
      <MainContent all={all} />
    </div>
  );
}
