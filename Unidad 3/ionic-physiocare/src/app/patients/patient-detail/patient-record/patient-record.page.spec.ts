import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientRecordPage } from './patient-record.page';

describe('PatientRecordPage', () => {
  let component: PatientRecordPage;
  let fixture: ComponentFixture<PatientRecordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
