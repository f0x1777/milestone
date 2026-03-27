import React from "react";
import { Composition } from "remotion";
import { MilestonePitch } from "./MilestonePitch";
import { FPS, TOTAL_FRAMES } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MilestonePitch"
        component={MilestonePitch}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
