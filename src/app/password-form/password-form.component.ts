import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {passwordMinLength} from "../constants";
import {BehaviorSubject, Subscription} from "rxjs";
import {ValidatorsErrors} from "../../validators-errors";


@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss'
})
export class PasswordFormComponent implements OnInit, OnDestroy{

  showPassword: boolean = false
  showConfirmPassword: boolean = false

  password = new FormControl('', {
    validators: [
      Validators.required, Validators.minLength(passwordMinLength)], updateOn: 'change'
  })
  passwordConfirm = new FormControl('', {validators: [Validators.required], updateOn: 'change'})

  passwordForm = new FormGroup({
    password: this.password,
    passwordConfirm: this.passwordConfirm
  }, passwordMatchValidator('password', 'passwordConfirm'))

  @Output()
  passwordFormEmitter = new BehaviorSubject<FormGroup>(this.passwordForm)
  passwordFormSubscription?: Subscription

  constructor() {
  }

  @Input()
  isLogin?: boolean

  @Input()
  isRegistration?: boolean

  ngOnInit() {
    if (this.isLogin) {
      this.password.clearValidators()
    }

    this.passwordFormSubscription = this.passwordForm.valueChanges.subscribe(() => {
      if (this.passwordForm.valid || this.isLogin) {
        this.passwordFormEmitter.next(this.passwordForm)
      }
    })
}

ngOnDestroy() {
  this.passwordFormSubscription?.unsubscribe()

}

  showPasswordContent(field: string) {
    if (field === 'password') this.showPassword = !this.showPassword
    else if (field === 'confirmPassword') this.showConfirmPassword = !this.showConfirmPassword
  }

  protected readonly ValidatorsErrors = ValidatorsErrors;
}

function passwordMatchValidator(passwordField: string, confirmField: string): ValidatorFn {
  return matchValidator(passwordField, confirmField, ValidatorsErrors.PasswordMismatch)
}

function matchValidator(field1: string, field2: string, error: ValidatorsErrors): ValidatorFn {
  return formGroup => {
    const match = formGroup.get(field1)?.value === formGroup.get(field2)?.value
    return match ? null : {[error]: {}}
  }
}


