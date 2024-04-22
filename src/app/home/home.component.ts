import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {UsersOnlineComponent} from "../users-online/users-online.component";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {ChallengeService} from "../services/challenge/challenge.service";
import {NgbdModalConfirmComponent} from '../ngbd-modal-confirm/ngbd-modal-confirm.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  registratiImg = "https://i.ibb.co/wcbmkfB/Dream-Shaper-v7-a-green-Snake-while-he-is-attacking-with-his-mo-1.jpg"
  modalRef: NgbModalRef | undefined
  userId: string | undefined
  titleChallengeInProgressErorr = 'Un\'altra sfida è in corso'
  messageChallengeInProgressErorr = 'Vuoi annullarla per iniziarne una nuova?'


  constructor(
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
      this.modalRef = this.modalService.open(UsersOnlineComponent);
    } catch (e) {
      this.openModal()
    }
  }

  ngOnDestroy(): void {
    if (this.modalRef) this.modalRef.close()
  }

  openModal() {
    const modalRef = this.modalService.open(NgbdModalConfirmComponent);
    modalRef.componentInstance.title = this.titleChallengeInProgressErorr;
    modalRef.componentInstance.message = this.messageChallengeInProgressErorr;

    modalRef.result.then(
      async (result) => {
        if(this.userId) await this.challengeService.deleteAllInProgressChallenges(this.userId)
      },
      (reason) => {
      }
    );
  }

}
