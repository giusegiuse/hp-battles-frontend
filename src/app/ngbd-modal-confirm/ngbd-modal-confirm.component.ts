import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-ngbd-modal-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngbd-modal-confirm.component.html',
  styleUrl: './ngbd-modal-confirm.component.scss'
})
export class NgbdModalConfirmComponent {
  @Input() title: string | undefined;
  @Input() message: string | undefined;

  constructor(public modal: NgbActiveModal) {
  }

}
