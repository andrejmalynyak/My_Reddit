import { useState } from "react";

function FullScreenableImage({ src, alt }: { src: string; alt: string }) {
  const [fullScreen, setFullScreen] = useState(false);

  return fullScreen ? (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center"
      onClick={() => setFullScreen(false)}
    >
      <div className="flex flex-col items-start justify-center">
        <img
          src={src}
          alt={alt}
          className="object-contain max-h-full max-w-full cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
        <a
          href={src}
          download
          className="text-slate-300 hover:text-white hover:underline transition-colors"
        >
          Download Image
        </a>
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className="object-cover w-full h-full hover:transform hover:scale-105 transition-transform"
      onClick={() => setFullScreen(true)}
    />
  );
}

export default function Gallery({ images }: { images: string[] }) {
  const gridTemplateAreas = {
    1: "'a'",
    2: "'a b'",
    3: "'a b' 'a c'",
    4: "'a b' 'c d'",
    5: "'a b c' 'a d e'",
    6: "'a b c' 'd e f'",
    7: "'a a b' 'a a f' 'c e f' 'd e g'",
    8: "'a a b' 'c d e' 'f g h'",
    9: "'a b c' 'd e f' 'g h i'",
  }[images.length];

  if (!gridTemplateAreas) {
    return (
      <div className="mt-3 h-[200px] bg-gray-200 rounded-lg flex justify-center items-center">
        <span className="text-red-500">Too many images to display</span>
      </div>
    );
  }

  const aspectRatio = {
    1: "1/1",
    2: "3/2",
    3: "3/2",
    4: "1/1",
    5: "4/3",
    6: "4/3",
    7: "1/1",
    8: "1/1",
    9: "1/1",
  }[images.length];

  return (
    <div
      className="mt-3 bg-gray-200 rounded-lg justify-center items-center overflow-hidden grid gap-0"
      style={{
        gridTemplateAreas: gridTemplateAreas,
        aspectRatio: aspectRatio,
      }}
    >
      {images.map((image, index) => (
        <div
          className="overflow-hidden w-full h-full"
          style={{
            gridArea: String.fromCharCode(97 + index),
          }}
          key={image}
        >
          <FullScreenableImage
            key={image}
            src={image}
            alt={`Image ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
}
