import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrtherComponent } from './orther.component';

describe('OrtherComponent', () => {
  let component: OrtherComponent;
  let fixture: ComponentFixture<OrtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrtherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
