import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Planets = [
  {
    "name": "Sun",
    "scale": 10,
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
    "name": "Mercurio",
    "scale": 17,
    "orbitRadius": 360,
    "position": 30,
    "speed": 2,
    "filename": "./mercurio.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.056
    }
  },
  {
    "name": "Venus",
    "scale": 25,
    "orbitRadius": 470,
    "position": 90,
    "speed": 2.5,
    "filename": "./venus.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.020
    }
  },
  {
    "name": "Tierra",
    "scale": 1,
    "orbitRadius": 660,
    "position": 160,
    "speed": 2.8,
    "filename": "./tierra.gltf",
    "speedRotate": {
      "negative": false, 
      "value": 0.086
    }
  },

  {
    "name": "Marte",
    "scale": 1,
    "orbitRadius": 890,
    "position": 160,
    "speed": 2.1,
    "filename": "./marte.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.087
    }
  },
  {
    "name": "Jupiter",
    "scale": 86,
    "orbitRadius": 1800,
    "position": 160,
    "speed": 0.7,
    "filename": "./jupiter.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.035
      
    }
  },
  {
    "name": "Saturno",
    "scale": 76,
    "orbitRadius": 2600,
    "position": 160,
    "speed": 0.5,
    "filename": "./saturno.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.038
    }
  },
  {
    "name": "Urano",
    "scale": 58,
    "orbitRadius": 3500,
    "position": 160,
    "speed": 0.3,
    "filename": "./urano.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.061
    }
  },
  {
    "name": "Neptuno",
    "scale": 58,
    "orbitRadius": 4060,
    "position": 160,
    "speed": 0.2,
    "filename": "./neptuno.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.057
    }
  }
]

const Home = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 150000);
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
            model.position.set(Math.cos(timestamp * planet.speed) * planet.orbitRadius, -1, Math.sin(timestamp * planet.speed) * planet.orbitRadius)
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
