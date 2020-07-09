import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IWeight, Weight } from 'app/shared/model/weight.model';
import { WeightService } from './weight.service';
import { WeightComponent } from './weight.component';
import { WeightDetailComponent } from './weight-detail.component';
import { WeightUpdateComponent } from './weight-update.component';

@Injectable({ providedIn: 'root' })
export class WeightResolve implements Resolve<IWeight> {
  constructor(private service: WeightService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWeight> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((weight: HttpResponse<Weight>) => {
          if (weight.body) {
            return of(weight.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Weight());
  }
}

export const weightRoute: Routes = [
  {
    path: '',
    component: WeightComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'twentyOnePointsApp.weight.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WeightDetailComponent,
    resolve: {
      weight: WeightResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.weight.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WeightUpdateComponent,
    resolve: {
      weight: WeightResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.weight.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WeightUpdateComponent,
    resolve: {
      weight: WeightResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.weight.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
