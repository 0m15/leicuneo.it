import Link from "next/link";
import { useEffect, useRef } from "react";
import PhotoGallery from "../Photogallery";

export function VideoClip({ src }) {
  return (
    <div
      className="flex flex-column flex-center w-100 h-100 bg-cover bg-center"
      style={{
        backgroundColor: "#121212",
      }}
    >
      <video key={src} controls style={{ height: "100%", width: "100%" }}>
        <source src={src} />
      </video>
    </div>
  );
}

export function AudioClip({ src, coverSrc }) {
  return (
    <div
      className="flex padding-1 flex-column w-100 h-100 bg-cover bg-center"
      style={{
        backgroundImage: `url(${coverSrc})`,
        justifyContent: "flex-end",
      }}
    >
      <audio
        key={src}
        controls
        src={src}
        className="w-100 shadow"
        style={{ objectFit: "cover" }}
      ></audio>
    </div>
  );
}

export function Gallery({ numPhotos = 4, basePath }) {
  const photos = [...Array(numPhotos).keys()].map(
    (d) =>
      "/media/" +
      basePath +
      "/" +
      "foto_" +
      (d + 1 > 10 ? d + 1 : "0" + (d + 1)) +
      ".jpg"
  );

  return <PhotoGallery photos={photos} />;
}

export function List({ items }) {
  return (
    <div className="list-view">
      {items.map((d, i) => {
        return (
          <Link
            href={`/contents/${d.path}`}
            key={i}
            className="list-item shadow padding-1"
          >
            <div className="flex space-between pb-1">
              <div>
                <div className="text-1 text-700">{d.tag}</div>
                <div className="text-2 text-em">{d.description}</div>
              </div>
              <div className="tag-single">
                <div
                  className={"tag tag-outline tag-circle tag-" + d.tag_slug}
                />
              </div>
            </div>
            <div
              className="cover"
              style={{
                minHeight: 220,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundImage: `url(/media/${d.path}/copertina.jpg)`,
              }}
            ></div>
          </Link>
        );
      })}
    </div>
  );
}
