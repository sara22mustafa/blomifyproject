import React from "react";
import { Vortex } from "react-loader-spinner";
export default function Loader(props) {
  const height = props.height;
  const width = props.width;
  return (
    <>
      <Vortex
        height={height}
        width={width}
        radius={5}
        colors={[
          "#E8E1DA",
          "#F3C0C7",
          "#AE6B77",
          "#4C1B1B",
          "#6C5A4B",
          "#F3C0C7",
        ]}
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </>
  );
}
