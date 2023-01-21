import Link from "next/link";
import { Back, MapMarker } from "../../components/Icons";
import { List } from "../../components/Media";
import { toSlug } from "../../utils";
import data from "../../data.json";
import { useEffect, useRef } from "react";

export async function getStaticPaths() {
  const posts = data;

  return {
    paths: posts
      .filter((d) => d.name?.length > 0)
      .map((d) => ({ params: { id: toSlug(d.name) || "404" } })),
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;

  const posts = data;
  const post = posts.find((d, i) => toSlug(d.name) == id);
  const children = posts
    .filter((d) => toSlug(d.name) == id)
    .map((d) => ({
      ...d,
      tag_slug: toSlug(d.tag),
      slug: toSlug(d.name),
    }));

  return {
    props: { ...post, children },
  };
}

export default function Post({
  name,
  address,
  meta_4,
  description,
  path,
  children,
}) {
  const baseUrl = path.split("/")[0];

  const bg = useRef();
  const head = useRef();
  const hero = useRef();

  useEffect(() => {
    const onScroll = (evt) => {
      let scrollRate =
        window.scrollY /
        (document.body.scrollHeight - document.body.clientHeight);
      bg.current.style.transform = `translate3d(0, ${
        (-scrollRate * window.innerHeight) / 3
      }px, 0)`;
      head.current.style.opacity = scrollRate * 2;
      hero.current.style.opacity = 1 - scrollRate * 3;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { passive: true });
    };
  }, []);

  return (
    <article>
      <div
        className="background-cover"
        ref={bg}
        style={{
          position: "fixed",
          top: 0,
          backgroundSize: "cover",
          width: "100%",
          minHeight: 480,
          backgroundImage: `url(/media/${baseUrl}/copertina.jpg)`,
          zIndex: 0,
        }}
      >
        <div
          ref={hero}
          className="w-100 bg-white"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="flex w-100" style={{ alignItems: "stretch" }}>
            <div className="pt-1 pr-1 pb-1" style={{ minHeight: "100%" }}>
              <Link href={`/`} style={{ display: "block" }}>
                <Back />
              </Link>
            </div>
            <div
              className="flex-column bg-white padding-1"
              style={{ minHeight: "100%" }}
            >
              <h1
                className="text-0 text-800"
                style={{ marginRight: "1em", lineHeight: 1.1 }}
              >
                {name}
              </h1>
              <div className="text-1 text-700">{address}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 400 }}></div>
      <div
        className="sticky bg-white padding-1"
        ref={head}
        style={{ opacity: 0 }}
      >
        <div className="flex items-center">
          <div style={{ marginLeft: "-1em" }}>
            <Link href={`/`} style={{ display: "block" }}>
              <Back />
            </Link>
          </div>
          <div>
            <h1 className="text-1 text-800">{name}</h1>
            <div className="text-700">{address}</div>
          </div>
        </div>
      </div>
      <div className="card-list">
        <List items={children} />
      </div>
    </article>
  );
}
