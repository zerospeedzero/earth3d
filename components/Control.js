import { useEffect, useState } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useSpring } from "framer-motion";

const initialSunRotation = new Vector3(1, 0, 0).applyAxisAngle(
  new Vector3(0, 0, 1),
  Math.PI * (15 / 180)
);
export const Control = () => {
  const sunRotationSpring = useSpring(0, { velocity: 10, bounce: 0 });
  const [direction, setDirection] = useState(
    initialSunRotation.clone()
  );
  const [config, setControls] = useControls(() => ({
    sunRotate: {
      label: "Sunlight",
      value: false,
    },
    sunRotation: {
      label: "Hour (24)", value: 0, min: 0, max: 24, step: 1,
    },
    earthRotate: {
      label: "Auto rotate",
      value: false,
    },
    rotationSpeed: {
      label: "Speed [1-10]", value: 1, min: 1, max: 10, step: 1,
    },
    showCities: {
      label: "Show cities",
      value: false,
    }
  }));
  useEffect(() => {
    sunRotationSpring.set(config.sunRotation);
  }, [config.sunRotation]);

  useEffect(() => {
    const unsubscribeRotation = sunRotationSpring.on("change", (v) => {
      const rotationAxis = new Vector3(0, 1, 0);
      const angle = Math.PI * (-v / 12);
      setDirection(initialSunRotation.clone().applyAxisAngle(rotationAxis, angle));
    });
    return () => {
      unsubscribeRotation();
    };
  }, []);
  useFrame((_, delta) => {
    if (config.sunRotate) {
      setControls({ sunRotation: config.sunRotation + delta });
    }
  }, []);
  return {direction, config};
};
