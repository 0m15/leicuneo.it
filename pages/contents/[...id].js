import { RelatedContent } from "../../components/Contents"
import { AudioClip, VideoClip } from "../../components/Media"
import data from "../data.json"

export function getStaticPaths() {
    //https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
    const paths = data.map((d) => ({ params: { id: d.path.split("/") } }))

    return {
        paths: paths,
        fallback: false, // can also be true or 'blocking'
    }
}

export function getStaticProps({ params }) {
    //https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
    const post = data.find((d, i) => d.path == params.id.join("/"))
    const relatedContent = data.filter((d, i) => d.path.split("/")[0] == params.id[0]&&d.path!==post.path)
    const relatedPlaces = data.filter((d, i) => d.tag == post.tag&&d.path!==post.path)

    return {
        props: { ...post, relatedContent, relatedPlaces }
    }
}

export default function Post({ name, address, description, media_type, path, relatedPlaces, relatedContent }) {

    const baseUrl = path

    return (<article>
        <h1>{name}</h1>
        <div>{description}</div>
        <div>
            {media_type === "video" && <VideoClip src={`/media/${path}/video.mp4`} />}
            {media_type === "audio"||media_type === "podcast" && <AudioClip src={`/media/${path}/audio.mp3`} />}
            {media_type === "pdf"&&<div>PDF</div>}
            {media_type === "gallery"&&<div>gallery</div>}
        </div>
        <div>
            <RelatedContent relatedContent={relatedContent} relatedPlaces={relatedPlaces} />
        </div>
    </article>)
}