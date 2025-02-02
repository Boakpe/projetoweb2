import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private userService: UserService, private router: Router) {}

  canActivate() {
    return this.userService.isAdmin$.pipe(
      take(1),
      map(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}
