import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { GamesComponent } from './pages/games/games.component';
import { AccountComponent } from './pages/account/account.component';
import { AdminGuard } from './guards/admin.guard';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'game/:id',
    component: GameDetailsComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'games',
    component: GamesComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  }
];