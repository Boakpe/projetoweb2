import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  registrationError: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http
        .post(`${environment.apiUrl}/users`, this.registerForm.value)
        .subscribe({
          next: (response: any) => {
            this.userService.login(response);
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Registration error:', error);
            this.registrationError = 'Registration failed. Please try again.';
          },
        });
    }
  }
}