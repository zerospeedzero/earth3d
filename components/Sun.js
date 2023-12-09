import { useEffect, useState } from 'react';
import { TextureLoader } from 'three';
import { useAnimation } from 'framer-motion';

export const Sun = (props) => {
  const [intensity, setIntensity] = useState(3);
  const controls = useAnimation();
  const [sunTexture, setSunTexture] = useState(null);
  useEffect(() => {
    controls.start({
      intensity: 30,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
      duration: 3,
      onUpdate: (latest) => {
        setIntensity(latest.intensity);
      },
      onComplete: () => {
        controls.start({ intensity: 3 });
      },
    });
  }, [controls]);
  useEffect(() => {
    const textureLoader = new TextureLoader();
    const loadSunTexture = async () => {
      const texture = await textureLoader.loadAsync('/images/2k_sun.jpg');
      setSunTexture(texture);
    };
    loadSunTexture();
    // return () => {
    //   textureLoader.dispose();
    // };
  }, []);
  return (
    <>
      <ambientLight intensity={5} />
      <mesh {...props}>
        <sphereGeometry args={[0.4, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissiveIntensity={intensity}
          toneMapped={true}
        />
      </mesh>
    </>
  );
};

