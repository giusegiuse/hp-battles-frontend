import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket/socket.service";
import {UserService} from "../services/user/user.service";
import {User} from "../model/user";
import {Router} from "@angular/router";
import {ChallengeService} from "../services/challenge/challenge.service";
import {AuthenticationService} from "../services/authentication/authentication.service";

@Component({
  selector: 'app-users-online',
  standalone: false,
  templateUrl: './users-online.component.html',
  styleUrl: './users-online.component.scss'
})
export class UsersOnlineComponent implements OnInit {

  users: any[] = [];
  highlightedUser: User | null = null;
  pcPlayerPhoto = 'https://c4.wallpaperflare.com/wallpaper/806/390/430/victoria-grovers-lord-voldemort-tom-riddle-harry-potter-digital-art-hd-wallpaper-preview.jpg'
  userId: string | undefined

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private challengeService: ChallengeService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
  }

  //TODO use a resolver to avoid use ngOninit async
  async ngOnInit() {
    this.userId = this.authenticationService.userId
    this.socketService.onUsersChanged().subscribe(async (updateOnlineUsers: string) => {
      const resultsPromises: Promise<any>[] = [];
      for (const id of updateOnlineUsers) {
        resultsPromises.push(this.userService.getUserInfoById(id));
      }
      try {
        const usersInfo = await Promise.all(resultsPromises);
        this.users = usersInfo.map(userInfo => {
          const userDetails = userInfo.data.doc;
          return new User(
            userDetails._id,
            userDetails.name,
            userDetails.email,
            userDetails.photo,
            userDetails.avgVictories
          );
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    });
  }

  highlightUser(user: User) {
    this.highlightedUser = user;
  }

  removeHighlight(user: User) {
    if (this.highlightedUser === user) {
      this.highlightedUser = null;
    }
  }

  async onePlayerChallenge(botOpponent: string) {
    const challengeId = (await this.challengeService.createOnePlayerChallenge(this.userId!, botOpponent)).challengeId
    await this.router.navigate(['/character']);
  }
}
