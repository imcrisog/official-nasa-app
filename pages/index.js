import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Planets = [
  {
    "name": "Sun",
    "scale": 3,
    "orbitRadius": null,
    "position": 0,
    "speed": 10,
    "filename": "./sun.gltf",
    "speedRotate": {
      "negative": true,
      "value": 0.03
    }
  },
  {
    "name": "Earth",
    "scale": 1,
    "orbitRadius": 190,
    "position": 30,
    "speed": 10,
    "filename": "./tierra.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.03
    }
  },
  {
    "name": "Mars",
    "scale": 1.2,
    "orbitRadius": 300,
    "position": 90,
    "speed": 70,
    "filename": "./marte.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.03
    }
  }
]

const Home = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.set(100, 100, 300);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement); 
    controls.autoRotate = true

    const loader = new GLTFLoader();

    Planets.forEach((planet, index) => {
      loader.load(planet.filename, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
  
        model.scale.set(planet.scale, planet.scale, planet.scale)
        model.position.set(planet.position, -1, 0);
  
        if (planet.name !== "sun") {
          let orbitRadius = planet.orbitRadius

          let pts = new THREE.Path().absarc(0, 0, orbitRadius, 0, Math.PI * 2).getPoints(90);
          let g = new THREE.BufferGeometry().setFromPoints(pts);
          let m = new THREE.LineBasicMaterial({ color: 'white', transparent: true, opacity: 1 });
          g.rotateX(- Math.PI / 2);
          let l = new THREE.Line(g, m);
          
          scene.add(l);
        }

        const animate = () => {
          requestAnimationFrame(animate);
          model.rotation.y = planet.speedRotate.negative ? model.rotation.y - planet.speedRotate.value : model.rotation.y + planet.speedRotate.value;
          if (planet.name !== "sun") {
            let timestamp = Date.now() * 0.0001;
            model.position.set(Math.cos(timestamp * 10) * planet.orbitRadius, -1, Math.sin(timestamp * 10) * planet.orbitRadius)
          }
          renderer.render(scene, camera);
        };
        animate();
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

  return <div ref={mountRef}></div>;
};

export default Home;
