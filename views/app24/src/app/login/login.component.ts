import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm : FormGroup;
    returnUrl : string;
    submitted : boolean;
    loading : boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authentication: AuthenticationService,
    private alert: ToastrService
  ) { }

  ngOnInit() {
    //create the login form
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    //get return url from route parameters or default to /
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  //getter for the form
  get f() { return this.loginForm.controls }

  onSubmit(){
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.loading = true;
    this.authentication.login(this.f.username.value, this.f.password.value)
    .pipe(first())
    .subscribe(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.loading = false;
        //display error
        this.alert.error("Wrong credentials")
      }
    )
  }
}
