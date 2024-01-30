import {Component, OnInit} from '@angular/core';
import {SocketService} from "./socket/socket.service";
import {AuthenticationService} from "./services/authentication/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'HP-battle';

  constructor(
    private socketService: SocketService,
    private readonly authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    if(this.authenticationService.isLoggedIn) {
      const id = this.authenticationService.userId
      if (id) {
         this.socketService.setId(id);
      }
    }
  }
}
