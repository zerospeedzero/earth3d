import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { SRGBColorSpace, TextureLoader, WebGLCubeRenderTarget } from "three";
import { Sun } from "@/components/Sun";
const Stars = ({ control }) => {
  const { gl, scene } = useThree();
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const loader = new TextureLoader();
    const loadTexture = () => {
      loader.load("/images/8k_stars_milky_way.jpg", (texture) => {
        texture.colorSpace = SRGBColorSpace;
        const cubeRenderTarget = new WebGLCubeRenderTarget(texture.image.height);
        cubeRenderTarget.fromEquirectangularTexture(gl, texture);
        setTexture(cubeRenderTarget.texture);
      });
    };
    loadTexture();
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [gl]);
  useEffect(() => {
    if (texture) {
      scene.background = texture;
    }
  }, [texture, scene]);
  return (
    <>
      <Sun position={control.direction.clone().multiplyScalar(14)} />
    </>
  );
};

export default Stars;
