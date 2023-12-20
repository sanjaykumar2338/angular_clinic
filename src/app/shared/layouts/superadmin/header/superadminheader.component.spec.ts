import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminHeaderComponent } from './superadminheader.component';

describe('HeaderComponent', () => {
  let component: SuperAdminHeaderComponent;
  let fixture: ComponentFixture<SuperAdminHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
