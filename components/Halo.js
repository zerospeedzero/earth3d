import { BackSide } from "three";
import { useEffect, useRef } from "react";
export const Halo =  ({ control }) => {
  const controlRef = useRef(control.direction.clone());

  useEffect(() => {
    controlRef.current.copy(control.direction);
  }, [control]);

  return (
    <mesh>
      <sphereGeometry args={[2.03, 1024, 1024]} />
      <meshStandardMaterial
          color="blue"
          transparent
          opacity={0.1}
        />      
    </mesh>
  );
};
