import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {UsersOnlineComponent} from "../users-online/users-online.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  registratiImg = "https://i.ibb.co/wcbmkfB/Dream-Shaper-v7-a-green-Snake-while-he-is-attacking-with-his-mo-1.jpg"
  modalRef: NgbModalRef | undefined

  constructor(
    private router: Router,
    public modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
  }

  navigateToUsersOnline(): void {
    this.modalRef = this.modalService.open(UsersOnlineComponent);
  }

  ngOnDestroy(): void{
    if(this.modalRef) this.modalRef.close()
  }
}
