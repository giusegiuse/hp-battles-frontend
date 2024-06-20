import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  public playAudio(audioFile: string){
    const audio = new Audio(audioFile);
    audio.muted = false;
    audio.play().then(r => {});
  }
}
