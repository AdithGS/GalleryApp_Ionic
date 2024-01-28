import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailViewPage } from './detail-view.page';

describe('DetailViewPage', () => {
  let component: DetailViewPage;
  let fixture: ComponentFixture<DetailViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
