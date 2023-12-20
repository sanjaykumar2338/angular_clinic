import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminFooterComponent } from './superadminfooter.component';

describe('FooterComponent', () => {
  let component: SuperAdminFooterComponent;
  let fixture: ComponentFixture<SuperAdminFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
