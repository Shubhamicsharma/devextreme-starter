import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import { AuthService, Credentials } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        DxButtonModule,
        DxCheckBoxModule,
        DxTextBoxModule,
        DxValidatorModule,
        DxValidationGroupModule,
    ],
})
export class LoginComponent {
    // Angular Dependency injection
    private authService = inject(AuthService);
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    onLoginClick() {
        if (this.loginForm.valid) {
            console.log('Form Submitted:', this.loginForm.value);
            const payload: Credentials = {
                username: this.loginForm.value.email,
                password: this.loginForm.value.password,
                token: '',
            };

            this.authService.login(payload).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    this.router.navigate(['/quick-monitor/currency']);
                },
                error: (error) => {
                    console.error('Login failed:', error);
                },
            });

        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.loginForm.get(controlName);
        return !!control?.touched && control.hasError(errorName);
    }
}
