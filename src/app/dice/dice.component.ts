import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgClass} from "@angular/common";
import * as THREE from 'three';
import {AudioService} from "../services/audio/audio.service";

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DiceComponent implements OnInit {
  number: number = 1;
  @Output() diceRolled = new EventEmitter<number>();
  @ViewChild('diceCanvas', { static: true }) diceCanvas: ElementRef | undefined;


  private scene: THREE.Scene | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private dice: THREE.Mesh | undefined;
  private targetRotation: THREE.Euler | undefined;
  private stopRolling: boolean | undefined;
  private animationId: number | undefined;

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit(){
    this.initThreeJS();
    this.animate();
    this.rollDice()
    this.playRollDiceSound();
  }

  private initThreeJS(){
    if(!this.diceCanvas) return
    const canvas = this.diceCanvas.nativeElement;
    const width = 250;
    const height = 250;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 2;
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    this.renderer.setSize(width, height);

    const loader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({ map: loader.load('assets/textures/dice-4.png'), transparent: false }),
      new THREE.MeshBasicMaterial({ map: loader.load('assets/textures/dice-5.png'), transparent: false }),
      new THREE.MeshBasicMaterial({ map: loader.load('assets/textures/dice-1.png'), transparent: false }),
      new THREE.MeshBasicMaterial({ map: loader.load('assets/textures/dice-3.png'), transparent: false }),
      new THREE.MeshBasicMaterial({ map: loader.load('assets/textures/dice-6.png'), transparent: false }),
      new THREE.MeshBasicMaterial({ map: loader.load('assets/textures/dice-2.png'), transparent: false }),
    ];

    const geometry = new THREE.BoxGeometry();
    this.dice = new THREE.Mesh(geometry, materials);
    this.scene.add(this.dice);
    this.stopRolling = false;
  }


  private animate() {
    if(!this.dice || !this.renderer || !this.scene || !this.camera) return
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.stopRolling && this.targetRotation) {

      this.dice.rotation.x += (this.targetRotation.x - this.dice.rotation.x) * 0.1;
      this.dice.rotation.y += (this.targetRotation.y - this.dice.rotation.y) * 0.1;
      this.dice.rotation.z += (this.targetRotation.z - this.dice.rotation.z) * 0.1;

      if (Math.abs(this.dice.rotation.x - this.targetRotation.x) < 0.01 &&
        Math.abs(this.dice.rotation.y - this.targetRotation.y) < 0.01 &&
        Math.abs(this.dice.rotation.z - this.targetRotation.z) < 0.01) {
        this.dice.rotation.set(this.targetRotation.x, this.targetRotation.y, this.targetRotation.z);
        this.stopRolling = false;

        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
      }
    } else {
      this.dice.rotation.x += 0.1;
      this.dice.rotation.y += 0.1;
    }

    this.renderer.render(this.scene, this.camera);
  }

  public rollDice() {
    setTimeout(() => {
      this.stopRolling = true;
      const faceIndex = Math.floor(Math.random() * 6) + 1;
      this.targetRotation = this.getRotationForFace(faceIndex);
      this.diceRolled.emit(faceIndex);
    }, 3000);
  }

  private getRotationForFace(faceIndex: number): THREE.Euler {
    switch (faceIndex) {
      case 0: return new THREE.Euler(0, 0, 0);
      case 1: return new THREE.Euler(Math.PI / 2, 0, 0);
      case 2: return new THREE.Euler(Math.PI, 0, 0);
      case 3: return new THREE.Euler(-Math.PI / 2, 0, 0);
      case 4: return new THREE.Euler(0, -Math.PI / 2, 0);
      case 5: return new THREE.Euler(0, Math.PI / 2, 0);
      default: return new THREE.Euler(0, 0, 0);
    }
  }

  playRollDiceSound() {
    this.audioService.playAudio(`/assets/sounds/dice-rolling.mp3`);
  }
}
