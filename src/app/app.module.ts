import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { LogoutComponent } from './components/page-logout/logout.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';

//Pages
import { LoginComponent } from './components/page-login/login.component';

//layouts
import { FooterComponent } from './shared/layouts/user/footer/footer.component';
import { HeaderComponent } from './shared/layouts/user/header/header.component';
import { SiteLayoutComponent } from './shared/layouts/user/site-layout/site-layout.component';

//admin
import { SuperAdminFooterComponent } from './shared/layouts/superadmin/footer/superadminfooter.component';
import { SuperAdminHeaderComponent } from './shared/layouts/superadmin/header/superadminheader.component';
import { SuperAdminLayoutComponent } from './shared/layouts/superadmin/site-layout/superadmin-layout.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxSelectModule } from 'ngx-select-ex';
import { AddClinicComponent } from './components/admin/add-clinic/addclinic.component';
import { EditClinicComponent } from './components/admin/edit-clinic/editclinic.component';
import { ClinicComponent } from './components/admin/page-clinic/clinic.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { ScheduleAppointmentAside } from './components/appointment/aside-pane/aside-pane.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { CreateScheduleComponent } from './components/configuration/create-schedule/create-schedule.component';
import { RoomsComponent } from './components/configuration/rooms/rooms.component';
import { CreateCampaignComponent } from './components/email-marketing/create-campaign/create-campaign.component';
import { EmailMarketingComponent } from './components/email-marketing/email-marketing.component';
import { EmailRecipientComponent } from './components/email-marketing/email-recipient/email-recipient.component';
import { ClinicBalanceComponent } from './components/finance/clinic-balance/clinic-balance.component';
import { ClinicSummaryComponent } from './components/finance/clinic-balance/clinic-summary/clinic-summary.component';
import { ClinicTransactionComponent } from './components/finance/clinic-balance/clinic-transaction/clinic-transaction.component';
import { clinicStatmentComponent } from './components/finance/clinic-balance/statements/statements.component';
import { SuppliersComponent } from './components/finance/clinic-balance/suppliers/suppliers.component';
import { ExpenseAsidePaneComponent } from './components/finance/expenses/aside-pane/aside-pane.component';
import { ExpenseComponent } from './components/finance/expenses/expense.component';
import { FinanceComponent } from './components/finance/finance.component';
import { PatienceBalanceComponent } from './components/finance/patience-balance/patience-balance.component';
import { PatientDetailComponent } from './components/finance/patience-balance/patience-detail/patience-detail.component';
import { PatientBalanceComponent } from './components/finance/patience-balance/patient-balance/patient-balance.component';
import { DocumentComponent } from './components/finance/patience-balance/patient-document/patient-document.component';
import { FacturationComponent } from './components/finance/patience-balance/patient-facturation/patient-facturation.component';
import { PatientTransactionComponent } from './components/finance/patience-balance/patient-transaction/patient-transaction.component';
import { RevenueAsidePaneComponent } from './components/finance/revenue/aside-pane/aside-pane.component';
import { RevenueComponent } from './components/finance/revenue/revenue.component';
import { AddGeneralStockComponent } from './components/inventory/general-stock/add-general-stock/add-general-stock.component';
import { GeneralStockComponent } from './components/inventory/general-stock/general-stock.component';
import { GeneralRestockComponent } from './components/inventory/general-stock/restock-pane/restock-pane.component';
import { ViewGeneralStockComponent } from './components/inventory/general-stock/view-general-stock/view-general-stock.component';
import { AddNewMaterialComponent } from './components/inventory/medication-material/add-new-material/add-new-material.component';
import { MedicationMaterialComponent } from './components/inventory/medication-material/medication-material.component';
import { RestockMaterialComponent } from './components/inventory/medication-material/restock-pane/restock-pane.component';
import { ViewMaterialComponent } from './components/inventory/medication-material/view-material-pane/view-material-pane.component';
import { AddNursingKardexComponent } from './components/nursing-kardex/add-new-kardex/add-kardex.component';
import { NursingKardexComponent } from './components/nursing-kardex/nursing-kardex.component';
import { AddNewSheetComponent } from './components/nursing-sheet/add-new-sheet/add-new-sheet.component';
import { NursingSheetComponent } from './components/nursing-sheet/nursing-sheet.component';
import { AddNursingComponent } from './components/nursing/aside-pane/aside-pane.component';
import { NursingComponent } from './components/nursing/nursing.component';
import { TokenInterceptor } from './core/token.interceptor';
import { FilterPipe } from './filter.pipe';
import { MomentDatePipe } from './pipe/moment.pipe';
import { UserProfileComponent } from './shared/layouts/user/user-profile/user-profile.component';
import { LoaderComponent } from './shared/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTutorialComponent,
    TutorialDetailsComponent,
    TutorialsListComponent,
    LoginComponent,
    SiteLayoutComponent,
    HeaderComponent,
    FooterComponent,
    LogoutComponent,
    SuperAdminHeaderComponent,
    SuperAdminFooterComponent,
    SuperAdminLayoutComponent,
    ClinicComponent,
    AddClinicComponent,
    EditClinicComponent,
    LoaderComponent,
    FinanceComponent,
    RevenueComponent,
    ExpenseComponent,
    FilterPipe,
    RevenueAsidePaneComponent,
    ExpenseAsidePaneComponent,
    MomentDatePipe,
    ClinicBalanceComponent,
    clinicStatmentComponent,
    ClinicTransactionComponent,
    SuppliersComponent,
    ClinicSummaryComponent,
    PatienceBalanceComponent,
    PatientDetailComponent,
    PatientBalanceComponent,
    FacturationComponent,
    PatientTransactionComponent,
    DocumentComponent,
    MedicationMaterialComponent,
    AddNewMaterialComponent,
    ViewMaterialComponent,
    RestockMaterialComponent,
    AddGeneralStockComponent,
    ViewGeneralStockComponent,
    GeneralRestockComponent,
    GeneralStockComponent,
    UserProfileComponent,
    EmailMarketingComponent,
    EmailRecipientComponent,
    CreateCampaignComponent,
    ConfigurationComponent,
    RoomsComponent,
    CreateScheduleComponent,
    AppointmentComponent,
    ScheduleAppointmentAside,
    NursingComponent,
    AddNursingComponent,
    NursingSheetComponent,
    AddNewSheetComponent,
    NursingKardexComponent,
    AddNursingKardexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatInputModule,
    SelectDropDownModule,
    NgxSelectModule,
    Daterangepicker,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    AngularSignaturePadModule,
  ],
  providers: [
    TokenInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  bootstrap: [AppComponent],
  exports: [LoaderComponent],
})
export class AppModule {}
