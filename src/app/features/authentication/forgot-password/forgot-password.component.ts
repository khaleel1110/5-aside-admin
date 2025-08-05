import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth, sendPasswordResetEmail} from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  standalone: true,
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private auth = inject(Auth);
  router = inject(Router);

  env = {
    websiteLink: 'https://ideasbelifantel.ng'
  };

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  handleForgotPassword() {
    const email = this.forgotPasswordForm.value.email as string;
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        alert('Password reset email sent successfully! Please check your inbox.');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        alert(error.message);
      });
  }
}
