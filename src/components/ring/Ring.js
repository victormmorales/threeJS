import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const Ring = ({ currentGem, currentRingColor, currentRingTexture }) => {
  const mountRef = useRef(null);
  const controls = useRef(null);
  const [ picker, setPicker ] = useState(null);

  useEffect(() => {
    //Data from the canvas
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    //Scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
    scene.add(camera);
    camera.position.set(5, 5, 5);
    camera.lookAt(new THREE.Vector3());

    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    //OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    //Resize canvas
    const resize = () => {
      renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
      camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    //
    //Mouse - Click
    const mouseCoors = new THREE.Vector2();
    function onMouseMove( event ) {
      // calcula la posición del mouse en coordenadas de dispositivo normalizadas: (-1 a +1) para ambos componentes
      mouseCoors.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouseCoors.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    };

    window.addEventListener('mousemove', (e) => onMouseMove(e));

    //mouse click
    let currentMesh = null;

    const mouseClick = () => {
        switch(currentMesh){
          case 'gem_blue':
            console.log('Gema Azul');
            console.log(currentMesh);
            setPicker(currentMesh);
            break;
          case 'gem_monkey':
            console.log('Gema Monos');
            console.log(currentMesh);
            setPicker(currentMesh);
            break;
            case 'gem_red':
            console.log('Gema Roja');
            console.log(currentMesh);
            setPicker(currentMesh);
            break;
          case 'ring_base':
            console.log('Anillo');
            console.log(currentMesh);
            setPicker(currentMesh);
            break;
          default:
            console.log('Nada');
            console.log(currentMesh);
            setPicker(currentMesh);
            break;
        }
    };

    window.addEventListener('click', () => mouseClick());

    //envMap
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const env = cubeTextureLoader.load([
        './model/envMap/px.png',
        './model/envMap/nx.png',
        './model/envMap/py.png',
        './model/envMap/ny.png',
        './model/envMap/pz.png',
        './model/envMap/nz.png',
    ]);

    //grupos
    const gems = new THREE.Group();
    console.log(gems);
    const ring = new THREE.Group();
    console.log(ring);

    //loaders
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load('./model/RingDraco/ringDraco.gltf', (gltf) => {
        while(gltf.scene.children.length) {
            gltf.scene.children[0].material.envMap = env
            if(gltf.scene.children[0].name.includes('gem')){
                gems.add(gltf.scene.children[0]);
            } else {
                ring.add(gltf.scene.children[0]);
            }
            scene.add(ring)
        }
    });

    //controls
    //change gem
    let currentGemScene = null;
    const changeGem = (gemName) => {
        scene.remove(currentGemScene);
        currentGemScene = null;

        for(let i = 0; i < gems.children.length; i++) {
            if(gems.children[i].name.includes(gemName.name)) {
                currentGemScene = gems.children[i].clone();
            }
        }
        if(currentGemScene !== null ){
            scene.add(currentGemScene);
        }
    };

    //change color
    const changeColorRing = (newColor) => {
        if(ring.children[0]) {
            ring.children[0].material.color.set(newColor.color);
        }
    };

    //change texture
    const changeRingTexture = (textures) => {
        if(ring.children[0]) {
            ring.children[0].material.map = textures.base;
            ring.children[0].material.normalMap = textures.normal;
            ring.children[0].material.roughnessMap = textures.roughness;
            ring.children[0].material.needsUpdate = true;
        }
    };

    controls.current = { changeGem, changeColorRing, changeRingTexture };

    //lights
    const ambientalLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(-100, 100, 100);
    scene.add(pointLight1);
    

    //
    //Raycaster
    const raycaster = new THREE.Raycaster();
    const collitions = [gems, ring];


    //Animate the scene
    const animate = () => {
      //Raycaster setup
      raycaster.setFromCamera(mouseCoors, camera);

      const raycasterCollitions = raycaster.intersectObjects(collitions);

      for ( const original of collitions ) {
        // console.log(collitions);
      };

      for (const collition of raycasterCollitions) {
        // console.log(collition);
      };

      if(raycasterCollitions.length) {
        // console.log(raycasterCollitions[0].object.name)
        currentMesh = raycasterCollitions[0].object.name;
      } else {
        currentMesh = null;
      }

      orbitControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
      controls.current.changeGem(currentGem);
  }, [currentGem]);

  useEffect(() => {
    controls.current.changeColorRing(currentRingColor);
  }, [currentRingColor]);

  useEffect(() => {
    controls.current.changeRingTexture(currentRingTexture);
  }, [currentRingTexture]);

  return (
    <>
    { picker && <h1>{picker}</h1>}
      <div
        className='Contenedor3D'
        ref={mountRef}
        style={{ width: "60%", height: "100%" }}
      ></div>
    </>
  );
};

export default Ring;