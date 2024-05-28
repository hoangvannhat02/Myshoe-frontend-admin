import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailimportvoicesComponent } from './detailimportvoices.component';

describe('DetailimportvoicesComponent', () => {
  let component: DetailimportvoicesComponent;
  let fixture: ComponentFixture<DetailimportvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailimportvoicesComponent]
    });
    fixture = TestBed.createComponent(DetailimportvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
