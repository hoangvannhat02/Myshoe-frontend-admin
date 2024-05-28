import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryvoucherComponent } from './categoryvoucher.component';

describe('CategoryvoucherComponent', () => {
  let component: CategoryvoucherComponent;
  let fixture: ComponentFixture<CategoryvoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryvoucherComponent]
    });
    fixture = TestBed.createComponent(CategoryvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
