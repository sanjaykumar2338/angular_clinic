import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuardService as AuthService,
  AuthGuardService as isAdmin,
  AuthGuardService as isNurse,
  AuthGuardService as isSuperAdmin,
} from './auth/auth-guard.service';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { DashboardComponent } from './components/page-dashboard/dashboard.component';
import { LoginComponent } from './components/page-login/login.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { SiteLayoutComponent } from './shared/layouts/user/site-layout/site-layout.component';

import { AddClinicComponent } from './components/admin/add-clinic/addclinic.component';
import { EditClinicComponent } from './components/admin/edit-clinic/editclinic.component';
import { ClinicComponent } from './components/admin/page-clinic/clinic.component';
import { SuperAdminLayoutComponent } from './shared/layouts/superadmin/site-layout/superadmin-layout.component';

import { AppointmentComponent } from './components/appointment/appointment.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { CreateScheduleComponent } from './components/configuration/create-schedule/create-schedule.component';
import { RoomsComponent } from './components/configuration/rooms/rooms.component';
import { CreateCampaignComponent } from './components/email-marketing/create-campaign/create-campaign.component';
import { EmailMarketingComponent } from './components/email-marketing/email-marketing.component';
import { EmailRecipientComponent } from './components/email-marketing/email-recipient/email-recipient.component';
import { ClinicBalanceComponent } from './components/finance/clinic-balance/clinic-balance.component';
import { ExpenseComponent } from './components/finance/expenses/expense.component';
import { FinanceComponent } from './components/finance/finance.component';
import { PatienceBalanceComponent } from './components/finance/patience-balance/patience-balance.component';
import { PatientDetailComponent } from './components/finance/patience-balance/patience-detail/patience-detail.component';
import { RevenueComponent } from './components/finance/revenue/revenue.component';
import { GeneralStockComponent } from './components/inventory/general-stock/general-stock.component';
import { MedicationMaterialComponent } from './components/inventory/medication-material/medication-material.component';
import { AddNursingKardexComponent } from './components/nursing-kardex/add-new-kardex/add-kardex.component';
import { NursingKardexComponent } from './components/nursing-kardex/nursing-kardex.component';
import { AddNewSheetComponent } from './components/nursing-sheet/add-new-sheet/add-new-sheet.component';
import { NursingSheetComponent } from './components/nursing-sheet/nursing-sheet.component';
import { NursingComponent } from './components/nursing/nursing.component';
import { LogoutComponent } from './components/page-logout/logout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'tutorials', component: TutorialsListComponent },
  { path: 'tutorials/:id', component: TutorialDetailsComponent },
  { path: 'add', component: AddTutorialComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'dashboard',
    component: SiteLayoutComponent,
    canActivate: [AuthService],
    children: [{ path: '', component: DashboardComponent }],
  },
  {
    path: 'superadmin',
    component: SuperAdminLayoutComponent,
    canActivate: [isSuperAdmin],
    children: [
      { path: '', component: ClinicComponent },
      { path: 'clinic/add', component: AddClinicComponent },
      { path: 'clinic/edit', component: EditClinicComponent },
    ],
  },
  {
    path: 'finance',
    component: SiteLayoutComponent,
    canActivate: [isAdmin],
    children: [
      { path: '', component: FinanceComponent },
      { path: 'revenue', component: RevenueComponent },
      { path: 'expenses', component: ExpenseComponent },
      { path: 'clinic-balance', component: ClinicBalanceComponent },
      { path: 'patience-balance', component: PatienceBalanceComponent },
      { path: 'patient-detail/:id', component: PatientDetailComponent },
    ],
  },
  {
    path: 'inventory',
    component: SiteLayoutComponent,
    canActivate: [isAdmin],
    children: [
      { path: '', redirectTo: 'medication-material', pathMatch: 'full' },
      { path: 'medication-material', component: MedicationMaterialComponent },
      { path: 'general-stock', component: GeneralStockComponent },
    ],
  },
  {
    path: 'email-marketing',
    component: SiteLayoutComponent,
    canActivate: [isAdmin],
    children: [
      { path: '', component: EmailMarketingComponent },
      { path: 'recipient', component: EmailRecipientComponent },
      { path: 'create-campaign', component: CreateCampaignComponent },
    ],
  },
  {
    path: 'configuration',
    component: SiteLayoutComponent,
    canActivate: [isAdmin],
    children: [
      { path: '', component: ConfigurationComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'create-schedule', component: CreateScheduleComponent },
    ],
  },
  {
    path: 'schedule-appointment',
    component: SiteLayoutComponent,
    canActivate: [isAdmin],
    children: [{ path: '', component: AppointmentComponent }],
  },
  {
    path: 'nursing',
    component: SiteLayoutComponent,
    canActivate: [isAdmin],
    children: [{ path: '', component: NursingComponent }],
  },
  {
    path: 'nursing-sheet',
    component: SiteLayoutComponent,
    canActivate: [isNurse],
    children: [
      { path: '', component: NursingSheetComponent },
      {
        path: 'add',
        component: AddNewSheetComponent,
      }
    ],
  },
  {
    path: 'nursing-kardex',
    component: SiteLayoutComponent,
    canActivate: [isNurse],
    children: [
      { path: '', component: NursingKardexComponent },
      { path: 'add', component: AddNursingKardexComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
