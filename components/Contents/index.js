import Link from "next/link";
import { useCallback, useState } from "react";

export function ListView({ contents }) {
  return (
    <div className="list-view scroller-y">
      {contents.map((d, i) => {
        return (
          <Link
            href={`/contents/${d.path}`}
            key={i}
            className="list-item list-item-link padding-1"
          >
            <div className="text-2 text-700">{d.description}</div>
            <div className="text-3">{d.name}</div>
          </Link>
        );
      })}
    </div>
  );
}

export function RelatedContent({
  relatedPlaces = [],
  relatedContent = [],
  name,
  tag,
}) {
  const [tab, setTab] = useState(0);

  const onClickTab = useCallback(
    (tabId) => () => {
      setTab(tabId);
    },
    []
  );

  return (
    <div className="pt-1" style={{ height: "50%", overflow: "hidden" }}>
      <div className="flex flex-center separator pb-1 pl-1 pr-1">
        <button
          className={
            "button text-2 button-pill button-ghost " +
            (tab === 0 ? "button-active" : "")
          }
          onClick={onClickTab(0)}
        >
          Contenuti abbinati a {name}
        </button>
        <button
          className={
            "button  text-2 button-pill button-ghost " +
            (tab === 1 ? "button-active" : "")
          }
          onClick={onClickTab(1)}
        >
          Contenuti abbinati a &quot;{tag}&quot;
        </button>
      </div>
      {tab == 0 && <ListView contents={relatedContent}></ListView>}
      {tab == 1 && <ListView contents={relatedPlaces}></ListView>}
    </div>
  );
}
