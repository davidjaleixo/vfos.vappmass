import { Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// import { AuthGuard } from './_guards';

export const APP_ROUTES: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // otherwise redirect to home
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  //{ path: '', loadChildren: './home/home.module#HomeModule'},
  { path: '**', redirectTo: '' }

];