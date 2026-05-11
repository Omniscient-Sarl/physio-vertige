import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1F4759",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 22,
            height: 22,
            display: "flex",
          }}
        >
          {/* Semicircular canal — hollow ring */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              border: "2.5px solid #FBF4E4",
              display: "flex",
            }}
          />
          {/* Otolith — filled dot, upper-right inside the ring */}
          <div
            style={{
              position: "absolute",
              top: 2,
              right: 1,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#FBF4E4",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
