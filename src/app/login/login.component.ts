import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup ({
    'email' : new FormControl(null),
    'password': new FormControl(null)
  })

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){
   console.log(this.loginForm.value)
  }

}
