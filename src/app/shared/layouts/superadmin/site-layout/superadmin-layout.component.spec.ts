import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminLayoutComponent } from './superadmin-layout.component';

describe('SiteLayoutComponent', () => {
  let component: SuperAdminLayoutComponent;
  let fixture: ComponentFixture<SuperAdminLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
