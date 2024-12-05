import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyReviewPage } from './modify-review.page';

describe('ModifyReviewPage', () => {
  let component: ModifyReviewPage;
  let fixture: ComponentFixture<ModifyReviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModifyReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
