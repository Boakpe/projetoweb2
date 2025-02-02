import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  loginError: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post(`${environment.apiUrl}/login/`, this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            this.userService.login(response);
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Login error:', error);
            this.loginError = 'Login failed. Please check your credentials.';
          },
        });
    }
  }
}
