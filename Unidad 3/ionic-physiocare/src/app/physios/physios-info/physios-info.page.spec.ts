import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhysiosInfoPage } from './physios-info.page';

describe('PhysiosInfoPage', () => {
  let component: PhysiosInfoPage;
  let fixture: ComponentFixture<PhysiosInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysiosInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
