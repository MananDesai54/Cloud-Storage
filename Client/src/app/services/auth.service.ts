import { Injectable } from '@angular/core';
import {
    SocialAuthService,
    GoogleLoginProvider,
    FacebookLoginProvider
} from 'angularx-social-login';

@Injectable()
export class AuthService {
    constructor(private socialAuthService: SocialAuthService) {
        this.socialAuthService.authState.subscribe(user => {
            console.log(user);
        })
    }

    signInWithGoogle() {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
    signInWithFacebook() {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
    signOut() {
        this.socialAuthService.signOut();
    }
}
