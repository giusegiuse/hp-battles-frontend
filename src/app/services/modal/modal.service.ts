import {DestroyRef, inject, Injectable} from "@angular/core";
import {NgbdModalConfirmComponent} from "../../ngbd-modal-confirm/ngbd-modal-confirm.component";
import {AppRoutes} from "../../http/app-routes";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private destroyRef = inject(DestroyRef)
  modalRef: NgbModalRef | undefined



  constructor(
    public modalService: NgbModal,
    private router: Router,
  ) { }

  openModal(title: string, message: string, rejectButton: boolean|false, route?: string, ) {
    const modalRef = this.modalService.open(NgbdModalConfirmComponent, {centered: true});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.rejectButtonEnabled = rejectButton;

    modalRef.result.then(
      async (result) => {
        await this.router.navigate([AppRoutes.Home]);

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
