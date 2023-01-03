import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';
import { ListView as ContentsListView } from '../components/Contents';
import MapView from '../components/Map';
import { Navbar } from '../components/Navbar';
import { ListView } from '../components/Places';
import { state } from '../store';
import data from "./data.json";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYXVyb3JhbWVjY2FuaWNhIiwiYSI6ImNsMnN3NWU5ZzAydTkzY2xydG8xdzB2dXEifQ.CUgsrj8QK3zSeDdUejuwmw"

export async function getStaticProps({ query }) {
  const places = data.filter(d => d.latlng?.trim().length > 0).map(d => {
    let latlng = d.latlng.split(",").map(d => parseFloat(d))
    
    return {
      ...d,
      latlng,
    }
  })

  console.log(places)

  return {
    props: {
      places: places
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
      <div>
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
      <ContentsListView contents={places} />
    </>
  )
}

function MainContent({ all }) {
  const [tab, setTab] = useState(0)
  const [filtered, setFiltered] = useState([...all])

  const onClickTab = useCallback((tabId) => () => {
    setTab(tabId)
  }, [])

  const onTagsChanged = useCallback((tag) => {
    let filtered = all.filter(d => d.tag == tag.tag)

    if (tag.subtag) {
      filtered = filtered.filter(d => d.subtag == tag.subtag)
    }
    setFiltered(filtered)
  }, [])

  const snap = useSnapshot(state)

  return (
    <>
      <div style={{ height: "auto", flex: 1, position: "relative" }}>
        <MapView places={filtered} all={all} />
      </div>
      {snap.showContentsPopover && (<div className="flex flex-column" style={{ height: 480, zIndex: 1 }}>
        <div>
          <div>
            <button onClick={onClickTab(0)}>Tutti i luoghi</button>
            <button onClick={onClickTab(1)}>Contenuti</button>
          </div>
        </div>
        <>
          {tab == 0 && <ListView places={filtered} />}
          {tab == 1 && <Tags onSelectionChanged={onTagsChanged} places={filtered} all={all} />}
        </>
      </div>)}
    </>

  )
}

export default function Index(props) {
  return (
    <div className="flex-column" style={{ height: "100%" }}>
      <Navbar />
      <MainContent all={props.places} />
    </div>
  )
}

