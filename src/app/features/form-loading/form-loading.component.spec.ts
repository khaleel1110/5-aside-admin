import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLoadingComponent } from './form-loading.component';

describe('FormLoadingComponent', () => {
  let component: FormLoadingComponent;
  let fixture: ComponentFixture<FormLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
