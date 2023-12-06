import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {Subject} from "rxjs";
import {emailRegex} from "../constants";
import { ValidatorsErrors } from '../../validators-errors'
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private _message$ = new Subject<string>();
  successMessage = '';

  staticAlertClosed = true;
  email = new FormControl('', [Validators.required, Validators.pattern(emailRegex)])
  password = new FormControl('', {validators: [Validators.required], updateOn: 'submit'})
  loginForm = new FormGroup({email: this.email, password: this.password})
  validatorsErrors = ValidatorsErrors

  constructor(private authenticationService: AuthenticationService,
              private router: Router
  ) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }


  async onSubmit(form: NgForm) {
    const credentials = this.loginForm.value
    if (!form.valid) {
      return
    }
    console.log("credentials"+JSON.stringify(credentials))
    try{
      await this.authenticationService.login(credentials.email!, credentials.password!)

    }catch(responseException: any){
      this.staticAlertClosed = false;
      if(responseException.error.error.statusCode === 404 || responseException.error.error.statusCode === 401){
        this.successMessage = 'Credenziali non valide';
        this.staticAlertClosed = false;
        this._message$.next(this.successMessage);
        setTimeout(() => {
          this.staticAlertClosed = true;
        }, 5000);
      }
      else{
        await this.router.navigate([''])
      }
    }
  }

  passwordEmitted(passwordFormGroup: FormGroup) {
    const passwordValue = passwordFormGroup.value
    this.password.setValue(passwordValue.password)
  }



}
