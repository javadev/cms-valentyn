import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPreferences, Preferences } from 'app/shared/model/preferences.model';
import { PreferencesService } from './preferences.service';
import { PreferencesComponent } from './preferences.component';
import { PreferencesDetailComponent } from './preferences-detail.component';
import { PreferencesUpdateComponent } from './preferences-update.component';

@Injectable({ providedIn: 'root' })
export class PreferencesResolve implements Resolve<IPreferences> {
  constructor(private service: PreferencesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPreferences> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((preferences: HttpResponse<Preferences>) => {
          if (preferences.body) {
            return of(preferences.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Preferences());
  }
}

export const preferencesRoute: Routes = [
  {
    path: '',
    component: PreferencesComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.preferences.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PreferencesDetailComponent,
    resolve: {
      preferences: PreferencesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.preferences.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PreferencesUpdateComponent,
    resolve: {
      preferences: PreferencesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.preferences.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PreferencesUpdateComponent,
    resolve: {
      preferences: PreferencesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'twentyOnePointsApp.preferences.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
