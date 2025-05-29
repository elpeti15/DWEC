import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhysioFormPage } from './physio-form.page';

describe('PhysioFormPage', () => {
  let component: PhysioFormPage;
  let fixture: ComponentFixture<PhysioFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysioFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
