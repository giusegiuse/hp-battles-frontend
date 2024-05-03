import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication/authentication.service";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit{

  requestSuccess: boolean = false

  email = new FormControl('', [Validators.required, Validators.email])
  forgotPasswordFormGroup = new FormGroup({
    email: this.email
  })

  constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
  }


  ngOnInit() {
    const captchaElement = this.document.querySelector<HTMLElement>('.grecaptcha-badge')
    if (captchaElement) captchaElement.style.visibility = 'visible'
  }

  async submit(){

  }

}
