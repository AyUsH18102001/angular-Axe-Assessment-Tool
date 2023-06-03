import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService {

  constructor(private authService:AuthService,private router:Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    const token = sessionStorage.getItem('token')!;
    if (token == null) {
      this.router.navigate(['']);
      return false;     
    }
    
    const authorize = this.authService.userAuthorization(token);

    if (authorize) {
      return true;
    }
    this.router.navigate(['']);
    return false; 
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuardService).canActivate(next, state);
}