import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditClinicComponent } from './editclinic.component';

describe('ClinicComponent', () => {
  let component: EditClinicComponent;
  let fixture: ComponentFixture<EditClinicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClinicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
