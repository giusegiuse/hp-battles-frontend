import {Component, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {UsersOnlineComponent} from "../users-online/users-online.component";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {ChallengeService} from "../services/challenge/challenge.service";
import {NgbdModalConfirmComponent} from '../ngbd-modal-confirm/ngbd-modal-confirm.component';
import {FooterComponent} from "../footer/footer.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbdModalConfirmComponent, FooterComponent, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  registratiImg = "https://i.ibb.co/wcbmkfB/Dream-Shaper-v7-a-green-Snake-while-he-is-attacking-with-his-mo-1.jpg"
  modalRef: NgbModalRef | undefined
  userId = signal('')
  titleChallengeInProgressErorr = 'Un\'altra sfida è in corso'
  messageChallengeInProgressErorr = 'Vuoi annullarla per iniziarne una nuova?'
  private destroyRef = inject(DestroyRef)

  constructor(
    public modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private challengeService: ChallengeService,
  ) {
  }

  ngOnInit(): void {
  }

  async navigateToUsersOnline() {
    if(!this.authenticationService.userId) return
    this.userId.set(this.authenticationService.userId)
    if (!this.userId) throw new Error('User not logged in')
    try {
      const result = await this.challengeService.checkInProgressChallenge(this.userId())
      if(result){
        this.modalRef = this.modalService.open(UsersOnlineComponent);
      }
    } catch (e) {
      this.openModal()
    }
  }

  openModal() {
    const modalRef = this.modalService.open(NgbdModalConfirmComponent);
    modalRef.componentInstance.title = this.titleChallengeInProgressErorr;
    modalRef.componentInstance.message = this.messageChallengeInProgressErorr;

    modalRef.result.then(
      async (result) => {
        if(this.userId) await this.challengeService.deleteAllInProgressChallenges(this.userId())
        this.modalRef = this.modalService.open(UsersOnlineComponent);
      },
      (reason) => {
      }
    );
    this.destroyRef.onDestroy(() => {
      if(!this.modalRef) return
      this.modalRef.close()
    })
  }

}
