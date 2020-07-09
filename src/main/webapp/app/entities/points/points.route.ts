import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPoints, Points } from 'app/shared/model/points.model';
import { PointsService } from './points.service';
import { PointsComponent } from './points.component';
import { PointsDetailComponent } from './points-detail.component';
import { PointsUpdateComponent } from './points-update.component';

@Injectable({ providedIn: 'root' })
export class PointsResolve implements Resolve<IPoints> {
  constructor(private service: PointsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPoints> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((points: HttpResponse<Points>) => {
          if (points.body) {
            return of(points.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Points());
  }
}

export const pointsRoute: Routes = [
  {
    path: '',
    component: PointsComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'twentyOnePointsApp.points.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PointsDetailComponent,
    resolve: {
      points: PointsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.points.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PointsUpdateComponent,
    resolve: {
      points: PointsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.points.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PointsUpdateComponent,
    resolve: {
      points: PointsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.points.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
