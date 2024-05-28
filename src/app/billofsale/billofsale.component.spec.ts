import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillofsaleComponent } from './billofsale.component';

describe('BillofsaleComponent', () => {
  let component: BillofsaleComponent;
  let fixture: ComponentFixture<BillofsaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillofsaleComponent]
    });
    fixture = TestBed.createComponent(BillofsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
