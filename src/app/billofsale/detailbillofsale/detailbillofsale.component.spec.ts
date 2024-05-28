import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailbillofsaleComponent } from './detailbillofsale.component';

describe('DetailbillofsaleComponent', () => {
  let component: DetailbillofsaleComponent;
  let fixture: ComponentFixture<DetailbillofsaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailbillofsaleComponent]
    });
    fixture = TestBed.createComponent(DetailbillofsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
