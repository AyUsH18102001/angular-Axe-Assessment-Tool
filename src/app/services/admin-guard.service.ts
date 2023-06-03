import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService{

  constructor(private authService:AuthService,private router:Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let data = next.data;
    let role = Object.values(data)[0] as string;
    const token = sessionStorage.getItem('token')!;
    if (token == null) {
      this.router.navigate(['']);
      return false;     
    }
    const tokenRole = this.authService.tokenRole(token);
    
    if (role == tokenRole) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }

}

export const AdminGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AdminGuardService).canActivate(next, state);
}
