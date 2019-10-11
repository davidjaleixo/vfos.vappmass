import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { ProjectsettingsComponent } from './projectsettings/projectsettings.component';
import { SlumphistoryComponent } from './slumphistory/slumphistory.component';
import { NotificationsComponent } from './notifications/notifications.component';

// import { AuthGuard } from '../_guards';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: LandingComponent},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'machines', component: ProjectsComponent},
      { path: 'machines/:idproject', component: ProjectdetailsComponent},
      { path: 'machines/:idproject/settings', component: ProjectsettingsComponent},
      { path: 'machines/:idproject/peelhistory', component: SlumphistoryComponent},
    ]
  }
];