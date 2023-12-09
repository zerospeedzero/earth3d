import { Sphere, Circle } from "@react-three/drei";
import {motion} from "framer-motion";
import { useRef, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";

const City = ({ city, popup, color }) => {
  const sphereRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const lat = city.lat;
  const lon = city.lng;
  const radius = 1;
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -radius * Math.sin(phi) * Math.cos(theta) * 2;
  const y = radius * Math.cos(phi) * 2;
  const z = radius * Math.sin(phi) * Math.sin(theta) * 2;
  const size =  Math.sqrt(city.population) * 9e-6
  useFrame(() => {
    if (isHovered) {
      sphereRef.current.material.color.set(0xff0000);
    } else {
      sphereRef.current.material.color.set(0xffa500);
    }
  });  
  return (
    <>
      <Sphere
        ref={sphereRef}
        position={[x, y, z]}
        args={[size, 16, 16]}
        // args={[0.01, 16, 16]}
        onClick={() => {console.log(city);popup(city);}}
        material-color={color}
        className="cursor-pointer"
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        >
      </Sphere>
    </>
  );
}
export default City