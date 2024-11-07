import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordUpdatePage } from './password-update.page';

describe('PasswordUpdatePage', () => {
  let component: PasswordUpdatePage;
  let fixture: ComponentFixture<PasswordUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
