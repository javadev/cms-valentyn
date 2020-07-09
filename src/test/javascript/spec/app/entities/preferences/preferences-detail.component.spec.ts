import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PreferencesDetailComponent } from 'app/entities/preferences/preferences-detail.component';
import { Preferences } from 'app/shared/model/preferences.model';

describe('Component Tests', () => {
  describe('Preferences Management Detail Component', () => {
    let comp: PreferencesDetailComponent;
    let fixture: ComponentFixture<PreferencesDetailComponent>;
    const route = ({ data: of({ preferences: new Preferences(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TwentyOnePointsTestModule],
        declarations: [PreferencesDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(PreferencesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PreferencesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load preferences on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.preferences).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
