import {Component, inject} from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownAnchor,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {Auth, getIdToken, signOut, User, user} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {GoogleAuthProvider} from "firebase/auth";
import {Subscription} from "rxjs";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownMenu
  ],
  templateUrl: './user-profile.component.html',

  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  router = inject(Router);
  private auth = inject(Auth);
  provider = new GoogleAuthProvider();
  user$ = user(this.auth);
  userSubscription: Subscription;
  userX: User | null = null;



  constructor() {


    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.

      if (aUser) {
        getIdToken(aUser, true).then(function (idToken) {
          // Send token to your backend via HTTPS
          console.log("idToken", idToken);
        }).catch(function (error) {
          // Handle error
        });
      }
      console.log(aUser);
      this.userX = aUser;
    })

    let actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://www.example.com/finishSignUp?cartId=1234',
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.ios'
      },
      android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'example.page.link'
    };

  }


  logOut() {
    signOut(this.auth).then(() => {
      // Sign-out successful.
      // alert('logged out successfully');
    }).catch((error) => {
      alert(error);
      // An error happened.

    });
  }
}
