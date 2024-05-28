import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportinvoicesComponent } from './importinvoices.component';

describe('ImportinvoicesComponent', () => {
  let component: ImportinvoicesComponent;
  let fixture: ComponentFixture<ImportinvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportinvoicesComponent]
    });
    fixture = TestBed.createComponent(ImportinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
