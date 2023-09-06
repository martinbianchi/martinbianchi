"use client";
import { useEffect, useRef } from "react";
import { init } from "./rubikCubeScene";

export const RubikCube = () => {
  const canvasContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = init();
    canvasContainer.current?.appendChild(element);

    return () => {
      canvasContainer.current?.removeChild(element);
    };
  }, []);

  return <div ref={canvasContainer}></div>;
};
