import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBloodPressure, BloodPressure } from 'app/shared/model/blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';
import { BloodPressureComponent } from './blood-pressure.component';
import { BloodPressureDetailComponent } from './blood-pressure-detail.component';
import { BloodPressureUpdateComponent } from './blood-pressure-update.component';

@Injectable({ providedIn: 'root' })
export class BloodPressureResolve implements Resolve<IBloodPressure> {
  constructor(private service: BloodPressureService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBloodPressure> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((bloodPressure: HttpResponse<BloodPressure>) => {
          if (bloodPressure.body) {
            return of(bloodPressure.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BloodPressure());
  }
}

export const bloodPressureRoute: Routes = [
  {
    path: '',
    component: BloodPressureComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'twentyOnePointsApp.bloodPressure.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BloodPressureDetailComponent,
    resolve: {
      bloodPressure: BloodPressureResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.bloodPressure.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BloodPressureUpdateComponent,
    resolve: {
      bloodPressure: BloodPressureResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.bloodPressure.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BloodPressureUpdateComponent,
    resolve: {
      bloodPressure: BloodPressureResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.bloodPressure.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
