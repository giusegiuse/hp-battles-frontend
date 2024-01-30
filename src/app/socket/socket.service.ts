import { Injectable } from '@angular/core';
import {backendUrl} from "../constants";
import {io} from "socket.io-client";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;
  private readonly SERVER_URL = backendUrl;
  public users: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
    this.socket = io(backendUrl);
    this.setupSocket();
  }

  private setupSocket(): void {
    this.socket.on('updateOnlineUsers', (onlineUsers: any) => {
      console.log("onUsersChanged" + onlineUsers)
      this.users.next(onlineUsers)
    });
  }

  public onUsersChanged(): BehaviorSubject<string> {
    return this.users;
  }

  public setId(id: string): void {
    this.socket.emit('setId', id);
  }

}
