/// <reference types="@angular/localize" />
import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from './app/store/effects/auth.effects';
import { EffectsModule } from '@ngrx/effects';
import { NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOptimizedImage } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { googleRecaptchaKey } from './app/constants';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { provideRouter, Routes, withViewTransitions } from '@angular/router';
import { AuthenticationInterceptor } from './app/services/authentication/authentication.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const appRoutes: Routes = [];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, ReactiveFormsModule, NgOptimizedImage, FormsModule, NgbModule, NgbAlertModule, RecaptchaV3Module, EffectsModule.forRoot([AuthEffects,]), StoreModule.forRoot({}, {})),
        CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
        provideRouter(appRoutes, withViewTransitions()),
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: googleRecaptchaKey },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));


