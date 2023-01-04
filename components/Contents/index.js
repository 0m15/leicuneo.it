import Link from "next/link"
import { useCallback, useState } from "react"

export function ListView({ contents }) {
    return (
        <div className="list-view  scroller-y">
            {contents.map((d, i) => {
                return (
                    <Link href={`/contents/${d.path}`} key={i} className="list-item list-item-link padding-1">
                        <div className="text-2">
                            {d.description}
                        </div>
                        <div className="text-3">
                            {d.name}
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export function RelatedContent({ relatedPlaces = [], relatedContent = [] }) {
    const [tab, setTab] = useState(0)

    const onClickTab = useCallback((tabId) => () => {
        setTab(tabId)
    }, [])

    return (
        <div>
            <div>
                <button onClick={onClickTab(0)}>contenuti correlati a 1</button>
                <button onClick={onClickTab(1)}>contenuti correlati a 2</button>
            </div>
            <div>
                {tab == 0 && <ListView contents={relatedContent}></ListView>}
                {tab == 1 && <ListView contents={relatedPlaces}></ListView>}
            </div>
        </div>
    )
}

