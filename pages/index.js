import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';
import { ListView as ContentsListView } from '../components/Contents';
import MapView from '../components/Map';
import { Navbar } from '../components/Navbar';
import { ListView } from '../components/Places';
import { location, state } from '../store';
import { calcDistance, toSlug } from '../utils';
import data from "./data.json";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYXVyb3JhbWVjY2FuaWNhIiwiYSI6ImNsMnN3NWU5ZzAydTkzY2xydG8xdzB2dXEifQ.CUgsrj8QK3zSeDdUejuwmw"

export async function getStaticProps({ query }) {
  const places = data.filter(d => d.latlng?.trim().length > 0).map(d => {
    let latlng = d.latlng.split(",").map(d => parseFloat(d))

    return {
      ...d,
      tag_slug: toSlug(d.tag),
      slug: toSlug(d.name),
      latlng,
    }
  })

  return {
    props: {
      places
    }
  }
}

function Tags({ places, all, onSelectionChanged = (selectedTag) => { } }) {

  const [activeTag, setActiveTag] = useState({
    tag: null,
    subtag: null,
  })

  const tags = useMemo(() => {
    return [...new Set(all.filter(d => d.tag?.trim().length > 0).map(d => d.tag))]
  }, [])

  const subtags = useMemo(() => {
    return [...new Set(all.filter(d => d.subtag?.trim().length > 0).map(d => d.subtag))]
  }, [])

  const tagsId = useMemo(() => {
    return [...new Set(all.filter(d => d.tag_slug?.trim().length > 0).map(d => d.tag_slug))]
  }, [])

  const onClickTag = useCallback((t) => () => {
    setActiveTag(cur => {
      const nextSel = {
        tag: t == cur.tag ? null : t,
        subtag: t !== "La valigia del Migrante" ? null : cur.subtag,
      }

      onSelectionChanged(nextSel)
      return nextSel
    })
  }, [])

  const onClickSubtag = useCallback((t) => () => {

    setActiveTag(cur => {

      const nextSel = {
        ...cur,
        subtag: cur.subtag === t ? null : t,
      }

      onSelectionChanged(nextSel)

      return nextSel
    })

  }, [])

  return (
    <>
      <div className='padding-1 button-list'>
        {tags.map((d, i) => {
          return (
            <button
              className={`button button-2 ${d == activeTag.tag ? "button-active" : ""}`}
              onClick={onClickTag(d)}
              key={d}>
              {d}
            </button>
          )
        })}

        {activeTag.tag == "La Valigia del Migrante" && <div>
          {subtags.map((d, i) => {
            return (
              <button
                className={`button button-2 ${d == activeTag.subtag ? "button-active" : ""}`}
                onClick={onClickSubtag(d)}
                key={d}>
                {d}
              </button>
            )
          })}
        </div>}
      </div>
      <div className='pl-1'>
        <div className='text-700'>
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
  )
}

function MainContent({ all }) {

  const [tab, setTab] = useState(0)
  const [tag, setTag] = useState(null)
  const [filtered, setFiltered] = useState([...all])

  const onClickTab = useCallback((tabId) => () => {
    setTab(tabId)
  }, [])

  const onTagsChanged = useCallback((tag) => {
    if (tag.tag === null) {
      setTag(null)
      return
    }

    setTag(tag)
  }, [])

  useEffect(() => {
    if (tag === null) {
      setFiltered([...all])
      return
    }

    let filtered = all.filter(d => d.tag == tag.tag)

    if (tag.subtag) {
      filtered = filtered.filter(d => d.subtag == tag.subtag)
    }

    setFiltered(filtered)

  }, [all, tag])

  const ui = useSnapshot(state)

  return (
    <>
      <div style={{ height: "auto", flex: 1, position: "relative" }}>
        <MapView places={filtered} all={all} />
      </div>
      {ui.showContentsPopover && (
        <div className="flex flex-column" style={{ height: 480, zIndex: 1 }}>
          <div className="flex flex-center button-list padding-1 separator">
            <button className={"button button-ghost " + (tab == 0 ? "button-active" : "")} onClick={onClickTab(0)}>Tutti i luoghi</button>
            <button className={"button button-ghost " + (tab == 1 ? "button-active" : "")} onClick={onClickTab(1)}>Contenuti</button>
          </div>
          <>
            {tab == 0 && <ListView places={filtered} />}
            {tab == 1 && <Tags onSelectionChanged={onTagsChanged} places={filtered} all={all} />}
          </>
        </div>
      )}
    </>

  )
}

export default function Index(props) {
  const [all, setAll] = useState([...props.places])
  const locationState = useSnapshot(location)

  useEffect(() => {
    setAll(cur => {
      return cur.map((d, i) => {
        return {
          ...d,
          distance: calcDistance(locationState.latitude, locationState.longitude, d.latlng[0], d.latlng[1]),
        }
      })
    })  
  }, [locationState.latitude, locationState.longitude]);

  console.log(all)

  return (
    <div className="flex-column" style={{ height: "100%" }}>
      <Navbar />
      <MainContent all={all} />
    </div>
  )
}

