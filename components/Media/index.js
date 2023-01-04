import Link from "next/link"

export function VideoClip(
    { src }
) {
    return (
        <div>
            <video controls style={{ height: "100%", width: "100%" }}>
                <source src={src} />
            </video>
        </div>
    )
}

export function AudioClip({ src, coverSrc }) {
    return (
        <div style={{
            display: "flex",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${coverSrc})`,
        }}>
            <audio controls src={src} style={{ objectFit: "cover", width: "100%" }}></audio>
        </div>
    )
}

export function PhotoGallery(
    { numPhotos = 4 }
) {
    return (
        <div>

        </div>
    )
}

export function Cover() {
    return null
}

export function List({
    items
}) {

    return (
        <div className="list">
            {
                items.map((d, i) => {
                    return <Link href={`/contents/${d.path}`} key={i} className="list-item shadow padding-1">
                        <div className="flex space-between">
                            <div>
                                <div className="text-2 text-700">{d.tag}</div>
                                <div className="text-3 text-em">{d.description}</div>
                            </div>
                            <div className="tag-single">
                                <div className={"tag tag-outline tag-circle tag-" + d.tag_slug}/>
                            </div>
                        </div>
                        <div style={{
                            minHeight: 220,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            backgroundImage: `url(/media/${d.path}/copertina.jpg)`
                        }}>
                        </div>
                    </Link>
                })
            }
        </div>
    )
}
