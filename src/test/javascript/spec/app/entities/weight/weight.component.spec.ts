import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, Data } from '@angular/router';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { WeightComponent } from 'app/entities/weight/weight.component';
import { WeightService } from 'app/entities/weight/weight.service';
import { Weight } from 'app/shared/model/weight.model';

describe('Component Tests', () => {
  describe('Weight Management Component', () => {
    let comp: WeightComponent;
    let fixture: ComponentFixture<WeightComponent>;
    let service: WeightService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TwentyOnePointsTestModule],
        declarations: [WeightComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: {
                subscribe: (fn: (value: Data) => void) =>
                  fn({
                    pagingParams: {
                      predicate: 'id',
                      reverse: false,
                      page: 0,
                    },
                  }),
              },
              queryParamMap: {
                subscribe: (fn: (value: Data) => void) =>
                  fn(
                    convertToParamMap({
                      page: '1',
                      size: '1',
                      sort: 'id,desc',
                    })
                  ),
              },
            },
          },
        ],
      })
        .overrideTemplate(WeightComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WeightComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WeightService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Weight(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.weights && comp.weights[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Weight(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.weights && comp.weights[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should calculate the sort attribute for an id', () => {
      // WHEN
      comp.ngOnInit();
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['id,desc']);
    });

    it('should calculate the sort attribute for a non-id attribute', () => {
      // INIT
      comp.ngOnInit();

      // GIVEN
      comp.predicate = 'name';

      // WHEN
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['name,desc', 'id']);
    });
  });
});
