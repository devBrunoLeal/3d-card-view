import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three-orbitcontrols-ts';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, FormsModule],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  carModel!: THREE.Object3D;
  controls!: OrbitControls;
  defaultCarColor = 0x005cbb; // Azul
  defaultWheelColor = 0x000000; // Preto
  selectedCar: any;

  ngOnInit(): void {
    this.selectedCar = this.carModels[0];
    this.init3D();
    this.loadCarModel();
  }

  carModels = [
    {
      id: 1,
      name: 'Volkswagen Gol GTi',
      year: '2000',
      carModel: '/models/gol_2000/scene.gltf',
      wheelsObject: 'Object_8',
      paintObject: 'Object_19',
      default: true,
    },
    {
      id: 2,
      name: 'Fusca',
      year: '1963',
      carModel: '/models/fusca_1963/scene.gltf',
      wheelsObject: 'Object_5',
      paintObject: 'Object_6',
    },
    {
      id: 3,
      name: 'Ecosport',
      year: '2015',
      carModel: '/models/ecosport_2015/scene.gltf',
      wheelsObject: 'eco_Rim1Mtl_0',
      paintObject: 'eco_Color2Mtl_0',
    },
    {
      id: 4,
      name: 'Civic',
      year: '2008',
      carModel: '/models/civic_2008/scene.gltf',
      wheelsObject: 'Material3_2',
      paintObject: 'Material3_11',
    },
    {
      id: 5,
      name: 'Amarok',
      year: '2009',
      carModel: '/models/amarok_2009/scene.gltf',
      wheelsObject: 'Object_37',
      paintObject: 'Object_23',
    },
    {
      id: 6,
      name: 'Fusion',
      year: '2015',
      carModel: '/models/fusion_2015/scene.gltf',
      wheelsObject: 'rims_paint',
      paintObject: 'Car_Paint.004',
    },
    {
      id: 7,
      name: 'Ford Ka',
      year: '2015',
      carModel: '/models/Ka_2015/scene.gltf',
      wheelsObject: 'Fl2Mtl',
      paintObject: 'Cor1Mtl',
    },
    {
      id: 8,
      name: 'Onix',
      year: '2018',
      carModel: '/models/onix_2018/scene.gltf',
      wheelsObject: 'wheel.1 wheel.004 wheel.005 wheel.012 wheel.013 wheel.008 wheel.009',
      paintObject: 'primary',
    },
    {
      id: 9,
      name: 'Toro',
      year: '2020',
      carModel: '/models/toro_2020/scene.gltf',
      wheelsObject: 'Material_25',
      paintObject: 'Material_17',
    },
    {
      id: 10,
      name: 'Twister',
      year: '2020',
      carModel: '/models/twister_2020/scene.gltf',
      wheelsObject: 'MATERIAL_TANQUE',
      paintObject: 'cor_moto.002_Vermelha',
    },
  ];

  selectCar(event: any) {
    const car = event.value;
    this.selectedCar = car;
    this.resetScene(); // Resetar a cena antes de carregar o novo carro
    this.loadCarModel(); // Carregar o novo modelo

  }

  resetScene() {
    // Remove o modelo atual da cena se existir
    if (this.carModel) {
      this.scene.remove(this.carModel);
      this.carModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    }
    // Reseta a câmera e os controles
    this.camera.position.set(0, 1.6, 10); // Reajusta a posição da câmera
    this.controls.reset(); // Reseta os controles
  }

  loadCarModel() {
    const loader = new GLTFLoader();
    loader.load(
      this.selectedCar?.carModel,
      (gltf: any) => {
        this.carModel = gltf.scene;

        // Centraliza o modelo
        const box = new THREE.Box3().setFromObject(this.carModel);
        const center = box.getCenter(new THREE.Vector3());

        // Ajusta a posição do modelo para o centro da cena
        this.carModel.position.sub(center);

        // Adiciona o modelo à cena
        this.scene.add(this.carModel);

        // Ajusta a posição da câmera
        const size = box.getSize(new THREE.Vector3()).length();
        this.camera.position.set(0, 1.6, size * 1.5); // Aumenta a distância da câmera
        this.camera.lookAt(center); // Faz a câmera olhar para o centro do modelo

        // Ajusta os controles de órbita
        this.controls.maxDistance = size * 0.8; // Distância máxima para zoom
        this.controls.minDistance = size * 0.5; // Distância mínima para zoom

        this.changeCarColor(this.defaultCarColor),
        this.changeWheelColor(this.defaultWheelColor)
      },
      undefined,
      (error: any) => {
        console.error('Erro ao carregar o modelo: ', error);
      }
    );
  }

  init3D() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff); 

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 10); 

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true; 
    document
      .getElementById('car-3d-container')
      ?.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; 
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 50; // Distância máxima
    this.controls.minDistance = 5; // Distância mínima
    this.controls.rotateSpeed = 0.5; // Velocidade de rotação
    this.controls.zoomSpeed = 0.5; // Velocidade de zoom

    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;
    this.scene.add(plane);

    // Luz principal
    const topLight = new THREE.DirectionalLight(0xffffff, 2);
    topLight.position.set(0, 5, 0); // Luz superior
    topLight.castShadow = true;
    this.scene.add(topLight);

    // Luzes laterais
    const sideLight1 = new THREE.DirectionalLight(0xffffff, 2);
    sideLight1.position.set(5, 3, 0); // Luz lateral direita
    sideLight1.castShadow = false;
    this.scene.add(sideLight1);

    const sideLight2 = new THREE.DirectionalLight(0xffffff, 2);
    sideLight2.position.set(-5, 3, 0); // Luz lateral esquerda
    sideLight2.castShadow = false;
    this.scene.add(sideLight2);

    const sideLight3 = new THREE.DirectionalLight(0xffffff, 2);
    sideLight3.position.set(0, 3, 5); // Luz frontal
    sideLight3.castShadow = false;
    this.scene.add(sideLight3);

    const sideLight4 = new THREE.DirectionalLight(0xffffff, 2);
    sideLight4.position.set(0, 3, -5); // Luz traseira
    sideLight4.castShadow = false;
    this.scene.add(sideLight4);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  changeCarColor(color: number) {
    this.carModel.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material) {
        console.log(child.name);
        console.log(child.material.name);
        if (
          child.name === this.selectedCar.paintObject ||
          child.material.name.includes(this.selectedCar.paintObject)
        ) {
          console.log(child.name);
          const material = child.material as THREE.MeshStandardMaterial;
          material.color.set(color); // Define a nova cor
          this.defaultCarColor = color;
        }
      }
    });
  }

  changeWheelColor(color: number) {
    this.carModel.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (
          child.name === this.selectedCar.wheelsObject ||
          child.material.name.includes(this.selectedCar.wheelsObject) ||
          this.selectedCar.wheelsObject.includes(child.material.name)
        ) {
          const material = child.material as THREE.MeshStandardMaterial;
          material.color.set(color); // Define a nova cor
          this.defaultWheelColor = color;
        }
      }
    });
  }

  onColorChange(event: any) {
    const color = event.target.value;
    this.changeCarColor(parseInt(color.replace('#', ''), 16));
  }

  onWheelColorChange(event: any) {
    const color = event.target.value;
    this.changeWheelColor(parseInt(color.replace('#', ''), 16));
  }
}
