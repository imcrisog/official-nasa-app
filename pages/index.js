import { useEffect, useRef, useState } from 'react';
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
    },
  },
  {
    "name": "Mercurio",
    "scale": 17,
    "orbitRadius": 360,
    "position": 30,
    "speed": 1.0,
    "filename": "./mercurio.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.056
    },
    "lineMaterial": {
      "color": "violet",
      "transparent": true,
      "opacity": 1
    }
  },
  {
    "name": "Venus",
    "scale": 25,
    "orbitRadius": 470,
    "position": 90,
    "speed": 1.2,
    "filename": "./venus.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.020
    },
    "lineMaterial": {
      "color": "light-blue",
      "transparent": true,
      "opacity": 1
    }
  },
  {
    "name": "Tierra",
    "scale": 1,
    "orbitRadius": 660,
    "position": 160,
    "speed": 2.3,
    "filename": "./tierra.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.086
    },
    "lineMaterial": {
      "color": "brown",
      "transparent": true,
      "opacity": 1
    }
  },

  {
    "name": "Marte",
    "scale": 1,
    "orbitRadius": 890,
    "position": 160,
    "speed": 1.7,
    "filename": "./marte.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.087
    },
    "lineMaterial": {
      "color": "red",
      "transparent": true,
      "opacity": 1
    }
  },
  {
    "name": "Jupiter",
    "scale": 86,
    "orbitRadius": 1800,
    "position": 160,
    "speed": 0.5,
    "filename": "./jupiter.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.035
    },
    "lineMaterial": {
      "color": "blue",
      "transparent": true,
      "opacity": 1
    }
  },
  {
    "name": "Saturno",
    "scale": 76,
    "orbitRadius": 2600,
    "position": 160,
    "speed": 0.3,
    "filename": "./saturno.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.038
    },
    "lineMaterial": {
      "color": "green",
      "transparent": true,
      "opacity": 1
    }
  },
  {
    "name": "Urano",
    "scale": 58,
    "orbitRadius": 3500,
    "position": 160,
    "speed": 0.2,
    "filename": "./urano.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.061
    },
    "lineMaterial": {
      "color": "purple",
      "transparent": true,
      "opacity": 1
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
    },
    "lineMaterial": {
      "color": "blue",
      "transparent": true,
      "opacity": 1
    }
  }
]

const Home = () => {
  const mountRef = useRef(null);
  const [animateEnabled, setAnimateEnabled] = useState(true);

  let INTERSECTED;
  let r_id = [];

  const cancelAllAnimations = () => {
    r_id.forEach(r => {
      cancelAnimationFrame(r)
    })
  }

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
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.set(100, 100, 300);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./public/360_F_461793247_aTvjPN7O4wuJiYieweyxzaO1K82y0cHb.jpg', (texture) => {
      scene.background = texture;  
    });

    const controls = new OrbitControls(camera, renderer.domElement); 
    controls.autoRotate = true

    renderer.domElement.addEventListener('click', (event) => onClick(event, camera, scene), false);

    const loader = new GLTFLoader();

    Planets.forEach(planet => {
      loader.load(planet.filename, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
  
        model.scale.set(planet.scale, planet.scale, planet.scale)
        model.position.set(planet.position, -1, 0);
  
        if (planet.name !== "sun") {
          let orbitRadius = planet.orbitRadius

          let pts = new THREE.Path().absarc(0, 0, orbitRadius, 0, Math.PI * 2).getPoints(90);
          let g = new THREE.BufferGeometry().setFromPoints(pts);
          let m = new THREE.LineBasicMaterial(planet.lineMaterial);
          g.rotateX(- Math.PI / 2);
          let l = new THREE.Line(g, m);
          
          scene.add(l);
        }

        const animate = () => {
          r_id.push(requestAnimationFrame(animate));
          model.rotation.y = planet.speedRotate.negative ? model.rotation.y - planet.speedRotate.value : model.rotation.y + planet.speedRotate.value;
          if (planet.name !== "sun") {
            let timestamp = Date.now() * 0.0001;
            model.position.set(Math.cos(timestamp * planet.speed) * planet.orbitRadius, -1, Math.sin(timestamp * planet.speed) * planet.orbitRadius)
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
    <h1 className='text-base'> NASA SPACE APP - VEDO TEAM - 0.1 SHOWCASE</h1>

    <div className='base' ref={mountRef} />
  </div>;
};

export default Home;
