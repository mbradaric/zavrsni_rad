import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone_number: [
          '',
          [Validators.required, Validators.pattern(/^[+]?[\d]{9,15}$/)],
        ],
        address: ['', Validators.required],
        city: ['', Validators.required],
        postal_code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value };

      delete formData.confirmPassword;
      this.http.post('http://127.0.0.1:8000/register/', formData).subscribe({
        next: (response) => {
          console.log('Registracija uspješna', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          if (error.status === 422) {
            console.error('Validation error: ', error.error);
          }
          alert('Registracija neuspješna.');
        },
        complete: () => {
          console.log('Registration request completed.');
        },
      });
    }
  }
}
