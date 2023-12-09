import { useEffect, useMemo, useRef, useState } from 'react';
import { Scene, RGBAFormat } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useFBO } from '@react-three/drei';
import { Control } from './Control';
import Earth from '@/components/Earth';
import Stars from '@/components/Stars';
import City from '@/components/City';

const Universe = ({popup}) => {
  const { scene, camera } = useThree();
  const cameraRef = useRef();
  const target = useFBO({ samples: 8, stencilBuffer: false, format: RGBAFormat });
  const control = Control();
  const [cities, setCities] = useState(null);
  const orbitControlsRef = useRef();
  const CameraMovement = () => {
    useFrame((state) => {
      // console.log(state.camera.position)
      // console.log(control)
      const radius = 10; 
      // const initialElaspedTime = Math.acos(state.camera.position.x / radius) 
      const elapsedTime =  control.config.rotationSpeed * state.clock.getElapsedTime() / 10;
      const x = Math.cos(elapsedTime) * radius;
      const z = Math.sin(elapsedTime) * radius;
      state.camera.position.set(x, 0, z);
      state.camera.position.set(x, 0, z);
      state.camera.lookAt(0, 0, 0);
      orbitControlsRef.current.update();
    });
    return null;
  };
  
  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch('/been_cities_population.json');
      const { maps } = await response.json();
      setCities(maps);
    };
    fetchCities();
  }, []);
  const background = useMemo(() => new Scene(), []);
  useFrame((point) => {
    cameraRef.current.rotation.copy(point.camera.rotation);
    point.gl.setRenderTarget(target);
    point.gl.render(scene, cameraRef.current);
    point.gl.setRenderTarget(null);
  });
  useEffect(() => {
    camera.layers.enable(1);
    scene.background = target.texture;
  }, [target.texture]);
  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault={false} position={[0, 0, 1]} />
      <Stars control={control} />
      <Earth control={control} />
      {control.config.earthRotate && <CameraMovement speed={control.config.speed} />}
      {/* <CameraMovement /> */}
      <OrbitControls ref={orbitControlsRef} minDistance={3} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {(cities && control.config.showCities) &&
        cities.map((city, index) => (
          <City key={index} city={city} popup={popup} color="orange" />
      ))}
    </>
  );
};

export default Universe;
