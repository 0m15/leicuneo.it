import { List } from "../../components/Media"
import { toSlug } from "../../utils"
import data from "../data.json"

export function getStaticPaths() {
    const posts = data

    return {
        paths: posts.map((d) => ({ params: { id: "" + toSlug(d.name) } })),
        fallback: false, // can also be true or 'blocking'
    }
}

export function getStaticProps({ params }) {
    const { id } = params

    const posts = data
    const post = posts.find((d, i) => toSlug(d.name) == id)
    const children = posts.filter(d => toSlug(d.name) == id).map(d => ({
        ...d,
        tag_slug: toSlug(d.tag),
        slug: toSlug(d.name),
    }))

    return {
        props: { ...post, children }
    }
}

export default function Post({ name, address, description, path, children }) {

    const baseUrl = path.split("/")[0]

    return (<article>
        <div
            className="background-cover"
            style={{
                backgroundSize: "cover",
                minHeight: 480,
                backgroundImage: `url(/media/${baseUrl}/copertina.jpg)`
            }} />
        <div className="sticky bg-white padding-1">
            <h1 className="text-1 text-800">{name}</h1>
            <div className="text-700">{address}</div>
        </div>
        <div>
            <List items={children} />
        </div>
    </article>)
}