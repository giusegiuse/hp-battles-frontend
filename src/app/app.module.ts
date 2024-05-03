import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {PasswordFormComponent} from "./password-form/password-form.component";
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationInterceptor} from "./services/authentication/authentication.interceptor";
import {provideRouter, Routes, withViewTransitions} from '@angular/router';
import {googleRecaptchaKey} from "./constants";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from "ng-recaptcha";
import { StoreModule } from '@ngrx/store';
import {AuthEffects} from "./store/effects/auth.effects";
import { EffectsModule } from '@ngrx/effects';

const appRoutes: Routes = [];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgOptimizedImage,
        FormsModule,
        NgbModule,
        NgbAlertModule,
        PasswordFormComponent,
        RecaptchaV3Module,
        EffectsModule.forRoot([AuthEffects,]),
        StoreModule.forRoot({}, {})
    ],

    providers: [CookieService,
        {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
        provideRouter(appRoutes, withViewTransitions()),
        {provide: RECAPTCHA_V3_SITE_KEY, useValue: googleRecaptchaKey}

    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
