import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {UsersOnlineComponent} from "../users-online/users-online.component";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {ChallengeService} from "../services/challenge/challenge.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  registratiImg = "https://i.ibb.co/wcbmkfB/Dream-Shaper-v7-a-green-Snake-while-he-is-attacking-with-his-mo-1.jpg"
  modalRef: NgbModalRef | undefined
  userId: string | undefined

  constructor(
    private router: Router,
    public modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private challengeService: ChallengeService,
  ) {
  }

  ngOnInit(): void {
  }

  async navigateToUsersOnline() {
    this.userId = this.authenticationService.userId
    if (!this.userId) throw new Error('User not logged in')
    try {
      await this.challengeService.checkInProgressChallenge(this.userId)
    } catch (e) {
      const mess = {
        message: 'You have an in progress challenge. Please finish it before starting a new one',
        type: 'error'
      }
      return
    }
    this.modalRef = this.modalService.open(UsersOnlineComponent);
  }

  ngOnDestroy(): void {
    if (this.modalRef) this.modalRef.close()
  }
}
