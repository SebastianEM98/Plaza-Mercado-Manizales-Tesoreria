import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentersComponent } from './renters.component';

describe('RentersComponent', () => {
  let component: RentersComponent;
  let fixture: ComponentFixture<RentersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RentersComponent]
    });
    fixture = TestBed.createComponent(RentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
