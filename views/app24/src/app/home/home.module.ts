import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule }    from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import {DataTableModule} from "angular-6-datatable";

import { NgxSpinnerModule } from 'ngx-spinner';

//import the home routes
import { homeRoutes } from './home.routes';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { ProjectsettingsComponent } from './projectsettings/projectsettings.component';
import { SlumphistoryComponent } from './slumphistory/slumphistory.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [LayoutComponent, LandingComponent, ProjectsComponent, ProjectdetailsComponent, ProjectsettingsComponent, SlumphistoryComponent, NotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    ReactiveFormsModule,
    FormsModule,
    DataTableModule,
    ChartsModule,
    NgxSpinnerModule
  ]
})
export class HomeModule { }
