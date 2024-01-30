import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResetPasswordTokenStatus} from "../model/authentication/reset-password-token-status";
import { resetPasswordIssueTexts } from './reset-pasword-text-data'

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  resetPasswordIssueTexts = resetPasswordIssueTexts
  resetPasswordTokenStatus = ResetPasswordTokenStatus


  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
