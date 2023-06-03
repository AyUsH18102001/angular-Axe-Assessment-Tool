import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { TokenLoginComponent } from './components/token-login/token-login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SharedModule } from '../shared/shared.module';
import { PrivateModule } from '../private/private.module';
import { PublicComponent } from './public.component';

@NgModule({
  declarations: [
    LoginComponent,
    TokenLoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    PublicComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PrivateModule
  ]
})
export class PublicModule { }
