import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LogoTitleComponent } from './components/logo-title/logo-title.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LogoTitleComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports:[
    LogoTitleComponent,
    NavbarComponent,
    FontAwesomeModule,
    FormsModule,
    RouterModule,
  ],
})
export class SharedModule { }
