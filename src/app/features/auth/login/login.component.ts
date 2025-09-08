import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';

import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        DxButtonModule,
        DxCheckBoxModule,
        DxTextBoxModule,
        DxValidatorModule,
        DxValidationGroupModule,
    ],
})
export class LoginComponent {
    constructor(private router: Router) {}

    onLoginClick(e: any) {
        // Basic validation
        if (e.validationGroup.validate().isValid) {
            // In a real app, you'd have authentication logic here.
            // For now, we'll just navigate to the home page.
            this.router.navigate(['/home']);
        }
    }
}
