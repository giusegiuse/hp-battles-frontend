import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    'email': new FormControl(null),
    'password': new FormControl(null),
    'password-confirm': new FormControl(null)
  });

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const credentials = this.signupForm.value

    console.log(this.signupForm.value)
  }


}
