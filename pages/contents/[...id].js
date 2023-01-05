import Link from "next/link";
import { useSnapshot } from "valtio";
import { RelatedContent } from "../../components/Contents";
import { Back, MapMarker } from "../../components/Icons";
import { AudioClip, Gallery, VideoClip } from "../../components/Media";
import { state } from "../../store";
import { toSlug } from "../../utils";
import data from "../../data.json";

export function getStaticPaths() {
  //https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
  const paths = data
    .filter((d) => d.path?.length > 0)
    .map((d) => ({ params: { id: d.path.split("/") } }));

  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
}

export function getStaticProps({ params }) {
  //https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
  const post = data.find((d, i) => d.path == params.id.join("/"));
  const relatedContent = data
    .filter(
      (d, i) => d.path.split("/")[0] == params.id[0] && d.path !== post.path
    )
    .map((d) => ({
      ...d,
      tag_slug: toSlug(d.tag),
      slug: toSlug(d.name),
    }));
  const relatedPlaces = data
    .filter((d, i) => d.tag == post.tag && d.path !== post.path)
    .map((d) => ({
      ...d,
      tag_slug: toSlug(d.tag),
      slug: toSlug(d.name),
    }));

  return {
    props: { ...post, slug: toSlug(post.name), relatedContent, relatedPlaces },
  };
}

export default function Post({
  name,
  slug,
  photo,
  meta_4,
  description,
  media_type,
  path,
  relatedPlaces,
  relatedContent,
  tag,
}) {
  const baseUrl = path;

  const coverSrc = `/media/${path}/copertina.jpg`;

  return (
    <article className="flex flex-column h-100">
      <div className="padding-1">
        <div className="flex w-100 items-center">
          <div style={{ marginLeft: "-1em" }}>
            <Link href={`/places/${slug}`} style={{ display: "block" }}>
              <Back />
            </Link>
          </div>
          <div>
            <Link href={`/places/${slug}`}>
              <h1 className="text-2">{name}</h1>
              <div className="text-3">{description}</div>
            </Link>
            <div className="text-3 text-em">{meta_4}</div>
          </div>
        </div>
      </div>
      <div style={{ height: "50%" }} className="flex flex-column flex-center">
        {media_type === "video" && (
          <VideoClip src={`/media/${path}/video.mp4`} />
        )}
        {(media_type === "audio" || media_type === "podcast") && (
          <AudioClip
            coverSrc={coverSrc}
            src={`/media/${path}/${media_type}.mp3`}
          />
        )}
        {media_type === "pdf" && (
          <div
            className="flex flex-center padding-1 flex-column w-100 h-100 bg-cover bg-center"
            style={{
              backgroundImage: `url(${coverSrc})`,
            }}
          >
            <Link
              href={`/media/${path}/ricetta.pdf`}
              className="button button-primary bg-white text-1"
            >
              Scarica il pdf
            </Link>
          </div>
        )}
        {media_type === "gallery" && (
          <Gallery basePath={path} numPhotos={photo} />
        )}
      </div>
      <RelatedContent
        name={name}
        tag={tag}
        relatedContent={relatedContent}
        relatedPlaces={relatedPlaces}
      />
    </article>
  );
}
