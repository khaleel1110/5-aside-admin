import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Auth, signInWithEmailAndPassword, signInWithPopup, signOut, User, user} from "@angular/fire/auth";
import { GoogleAuthProvider, } from "firebase/auth";
import {Router, RouterLink, RouterLinkActive, ROUTES} from "@angular/router";
import {Subscription} from "rxjs";
import {JsonPipe} from "@angular/common";
import {  hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
const authenticationBasedRoleRedirect ='' ;
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
  router=inject(Router);
  private auth = inject(Auth);
  provider = new GoogleAuthProvider();
  user$ = user(this.auth);
  userSubscription: Subscription;
  userX: User | null = null;


  env = {
    websiteLink : 'https://ideasbelifantel.ng'
  };

  profileForm = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', [Validators.required, Validators.maxLength(13)]),
    Text: new FormControl(''),


    password: new FormControl('',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ]),

  });


  constructor() {


    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      console.log(aUser);
      this.userX=aUser;
    })



  }



  handleSubmit() {
    signInWithEmailAndPassword(this.auth,
      this.profileForm.value.email as string,
      this.profileForm.value.password as string)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        alert(
          "user logged in successfully!",
        );
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(
          errorMessage
        );
        // ..
      });



  }

  googlesignin() {


    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        /*this.router.navigateByUrl("/admin/dashboard")*/
        this.router.navigate(['/admin/dashboard']);
        alert('user logged in')


        // ...
      }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.

      alert(errorMessage);
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }


  logOut(){
    signOut(this.auth).then(() => {
      // Sign-out successful.
      alert('logged out successfully');
    }).catch((error) => {
      // An error happened.

    });
  }




  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.userSubscription.unsubscribe();
  }


}
