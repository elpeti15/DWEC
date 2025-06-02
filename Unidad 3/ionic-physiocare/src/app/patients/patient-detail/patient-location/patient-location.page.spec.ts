import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientLocationPage } from './patient-location.page';

describe('PatientLocationPage', () => {
  let component: PatientLocationPage;
  let fixture: ComponentFixture<PatientLocationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
