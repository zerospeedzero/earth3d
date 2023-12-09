import { useEffect, useState, useRef } from "react";
import { Vector3, SRGBColorSpace, MaterialLoader, Mesh } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { fragmentShader as fS, vertexShader as vS } from "./EarthShader";
import { Halo } from "@/components/Halo";

export default ({ control }) => {
  const day = useLoader(TextureLoader, "/images/8k_earth_daymap.jpg")
  day.colorSpace = SRGBColorSpace
  const night = useLoader(TextureLoader, "/images/8k_earth_nightmap.jpg")
  night.colorSpace = SRGBColorSpace
  const cloud = useLoader(TextureLoader, "/images/8k_earth_clouds.jpg")
  cloud.colorSpace = SRGBColorSpace

  const earthRef = useRef({
    day: { value: day },
    night: { value: night },
    cloud: { value: cloud },
    uTime: { value: 0 },
    control: { value: control.direction.clone() },
  },);

  useFrame((_, delta) => {
    earthRef.current.uTime.value += delta;
    // console.log(control)
  });

  useEffect(() => {
    earthRef.current.control.value.copy(control.direction);
  }, [control]);
  return (
    <Sphere args={[2, 1024, 1024]}>
      <Halo control={control} />
      {/* <meshStandardMaterial
        map={day}
      /> */}
      <shaderMaterial 
        vertexShader={vS}
        fragmentShader={fS}
        uniforms={earthRef.current}
      /> 
    </Sphere>
  );
};
