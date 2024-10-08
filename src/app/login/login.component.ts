import {Component, DestroyRef, Inject, OnInit, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {Subject} from "rxjs";
import {emailRegex} from "../constants";
import {ValidatorsErrors} from '../../validators-errors'
import {Router, RouterModule} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {SocketService} from "../socket/socket.service";
import {PasswordFormComponent} from "../password-form/password-form.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, PasswordFormComponent, ReactiveFormsModule, NgbModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private _message$ = new Subject<string>();
  errorMessage = '';
  staticAlertClosed = true;
  email = new FormControl('', [Validators.required, Validators.pattern(emailRegex)])
  password = new FormControl('', {validators: [Validators.required], updateOn: 'submit'})
  loginForm = new FormGroup({email: this.email, password: this.password})
  validatorsErrors = ValidatorsErrors
  private destroyRef = inject(DestroyRef)

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private socketService: SocketService,
              @Inject(DOCUMENT) private readonly document: Document,
  ) {

  }

  ngOnInit(): void {
    const captchaElement = this.document.querySelector<HTMLElement>('.grecaptcha-badge')
    if (captchaElement) captchaElement.style.visibility = 'visible'
    this.destroyRef.onDestroy(()=> {
      captchaElement!.style.visibility = 'hidden'
    })
  }

  async login() {
    const credentials = this.loginForm.value
    let id = ''
    if (!this.loginForm.valid) {
      this.email.markAsDirty()
      this.password.markAsDirty()
      return
    }
    try {
      id = await this.authenticationService.login(credentials.email!, credentials.password!)
    } catch (responseException: any) {
      this.staticAlertClosed = false;
      if (responseException.error.error.statusCode === 404 || responseException.error.error.statusCode === 401) {
        this.errorMessage = 'Credenziali non valide';
        this.staticAlertClosed = false;
        this._message$.next(this.errorMessage);
        setTimeout(() => {
          this.staticAlertClosed = true;
        }, 5000);
      }
    }
    if (credentials.email) this.socketService.setId(id);
    await this.router.navigate([''])

  }

  passwordEmitted(passwordFormGroup: FormGroup) {
    const passwordValue = passwordFormGroup.value
    this.password.setValue(passwordValue.password)
  }


}
