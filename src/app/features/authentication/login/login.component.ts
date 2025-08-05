import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Auth, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, User, user } from "@angular/fire/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Subscription } from "rxjs";
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'yex-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  router = inject(Router);
  private auth = inject(Auth);
  provider = new GoogleAuthProvider();
  user$ = user(this.auth);
  userSubscription: Subscription;
  userX: User | null = null;

  env = {
    websiteLink: 'https://ideasbelifantel.ng'
  };

  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30)
    ]),
  });

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log(aUser);
      this.userX = aUser;
    });
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('signupSrPassword') as HTMLInputElement;
    const icon = document.getElementById('changePassIcon') as HTMLElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('bi-eye');
      icon.classList.add('bi-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.remove('bi-eye-slash');
      icon.classList.add('bi-eye');
    }
  }

  handleSubmit() {
    signInWithEmailAndPassword(this.auth,
      this.profileForm.value.email as string,
      this.profileForm.value.password as string)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("user logged in successfully!");
        this.router.navigate(['/admin/dashboard']);
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  googlesignin() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        this.router.navigate(['/admin/dashboard']);
        alert('user logged in');
      }).catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
  }

  logOut() {
    signOut(this.auth).then(() => {
      alert('logged out successfully');
    }).catch((error) => {
      alert(error.message);
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
