import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Interface from './interface';
import Planets from './api/Planets.json'

const Home = () => {
  const mountRef = useRef(null);
  const [animateEnabled, setAnimateEnabled] = useState(true);

  let scene, camera, renderer, controls, INTERSECTED;
  let r_id = [];

  function onClick(event, camera, scene) {
    event.preventDefault();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
          INTERSECTED = intersects[0].object;
        }
    } else {
        INTERSECTED = null;
    }
  }

  useEffect(() => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.set(100, 100, 500);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./background.jpg', (texture) => {
      scene.background = texture;  
    });

    controls = new OrbitControls(camera, renderer.domElement); 
    controls.autoRotate = true

    renderer.domElement.addEventListener('click', (event) => onClick(event, camera, scene), false);

    const loader = new GLTFLoader();

    Planets.forEach(planet => {
      loader.load(planet.filename, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
  
        model.scale.set(planet.scale, planet.scale, planet.scale)
        model.position.set(planet.position, -1, 0);
  
        if (planet.name !== "Sun") {
          const points = [];
          const segments = 90;
          const orbitRadiusX = planet.orbit.x;
          const orbitRadiusZ = planet.orbit.z;

          const centerX = planet.orbit.centerX; 

          for (let i = 0; i <= segments; i++) {
              const theta = (i / segments) * Math.PI * 2;
              const x = Math.cos(theta) * orbitRadiusX + centerX; 
              const z = Math.sin(theta) * orbitRadiusZ + 0;
              points.push(new THREE.Vector3(x, 0, z));
          }

          const path = new THREE.BufferGeometry().setFromPoints(points);

          const lineMaterial = new THREE.LineBasicMaterial(planet.lineMaterial);
          const ellipseLine = new THREE.Line(path, lineMaterial);

          scene.add(ellipseLine);
        }

        const animate = () => {
          r_id.push(requestAnimationFrame(animate));
          model.rotation.y = planet.speedRotate.negative ? model.rotation.y - planet.speedRotate.value : model.rotation.y + planet.speedRotate.value;
          if (planet.name !== "Sun") {
            let timestamp = Date.now() * 0.0001;
            model.position.set(Math.cos(timestamp * planet.speed) * planet.orbit.x + planet.orbit.centerX, -1, Math.sin(timestamp * planet.speed) * planet.orbit.z)
          }
          renderer.render(scene, camera);
        };
        animate()
      }, undefined, (error) => {
        console.error('Error loading model:', error);
      });  
    })
    
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div>
    <h1 className='text-base'> NASA SPACE APP - VEDO TEAM - 0.4 SHOWCASE</h1>
      <Interface />
    <div className='base' ref={mountRef} />
  </div>;
};

export default Home;
