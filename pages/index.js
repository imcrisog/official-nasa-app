import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Interface from './interface';

export const Planets = [
  {
    "name": "Sun",
    "desc": "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma.",
    "scale": 3,
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
    "name": "Mercury",
    "desc": "Mercury is the smallest and innermost planet in the Solar System. It is the closest planet to the Sun and the second-closest planet to the Earth.",
    "scale": 17,
    "orbit": {
      "x": 190,
      "z": 190,
      "centerX": 0,
      "centerZ": 0
    },
    "position": 150,
    "speed": 2,
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
    "desc": "Venus is the second planet from the Sun and the brightest object in the night sky.",
    "scale": 25,
    "orbit": {
      "x": 300,
      "z": 300,
      "centerX": 0,
      "centerZ": 0
    },
    "orbitRadius": 300,
    "position": 90,
    "speed": 2.5,
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
    "name": "Earth",
    "desc": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
    "scale": 1,
    "orbit": {
      "x": 460,
      "z": 460,
      "centerX": 0,
      "centerZ": 0
    },
    "orbitRadius": 460,
    "position": 160,
    "speed": 5,
    "filename": "./tierra.gltf",
    "speedRotate": {
      "negative": false,
      "value": 0.0086
    },
    "lineMaterial": {
      "color": "brown",
      "transparent": true,
      "opacity": 1
    }
  },

  {
    "name": "Mars",
    "desc": "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.",
    "scale": 1,
    "orbit": {
      "x": 590,
      "z": 590,
      "centerX": 0,
      "centerZ": 0
    },
    "orbitRadius": 590,
    "position": 160,
    "speed": 2.1,
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
    "desc": "Jupiter is the largest planet in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun.",
    "scale": 86,
    "orbit": {
      "x": 950,
      "z": 950,
      "centerX": 0,
      "centerZ": 0
    },
    "orbitRadius": 950,
    "position": 160,
    "speed": 0.7,
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
    "name": "Saturn",
    "desc": "Saturn is the sixth planet from the Sun and the second-largest planet in the Solar System.",
    "scale": 76,
    "orbit": {
      "x": 1500,
      "z": 1500,
      "centerX": 0,
      "centerZ": 0
    },
    "orbitRadius": 1500,
    "position": 160,
    "speed": 0.5,
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
    "name": "Uranus",
    "desc": "Uranus is the seventh planet from the Sun and the third-largest planet in the Solar System.",
    "scale": 58,
    "orbit": {
      "x": 2000,
      "z": 2000,
      "centerX": 0,
      "centerZ": 0
    },
    "orbitRadius": 2000,
    "position": 160,
    "speed": 0.3,
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
    "name": "Neptune",
    "desc": "Neptune is the eighth and farthest known planet from the Sun. It is named after the Roman god of the sea, Neptune.",
    "scale": 58,
    "orbit": {
      "x": 2600,
      "z": 2600,
      "centerX": 0,
      "centerZ": 0
    },
    "orbitRadius": 2600,
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

    camera.position.set(100, 100, 500);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./background.jpg', (texture) => {
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
    <h1 className='text-base'> NASA SPACE APP - VEDO TEAM - 0.1 SHOWCASE</h1>
    <Interface />
    <div className='base' ref={mountRef} />
  </div>;
};

export default Home;
