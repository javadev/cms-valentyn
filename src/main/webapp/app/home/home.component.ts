import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { PointsService } from 'app/entities/points/points.service';
import { JhiEventManager } from 'ng-jhipster';
import { PreferencesService } from 'app/entities/preferences/preferences.service';
import { Preferences } from 'app/shared/model/preferences.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  pointsThisWeek: any = {};
  pointsPercentage?: number;
  preferences?: Preferences;

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private pointsService: PointsService,
    private preferencesService: PreferencesService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit(): void {
    // eslint-disable-next-line no-console
    console.log('ngOnInit');
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      if (this.isAuthenticated()) {
        this.getUserData();
      }
    });
    this.registerAuthenticationSuccess();
  }

  registerAuthenticationSuccess(): void {
    // eslint-disable-next-line no-console
    console.log('registerAuthenticationSuccess');
    this.eventManager.subscribe('authenticationSuccess', () => {
      // eslint-disable-next-line no-console
      console.log('authenticationSuccess fired');
      this.accountService.getAuthenticationState().subscribe(account => {
        this.account = account;
        this.getUserData();
      });
    });

    this.authSubscription = this.eventManager.subscribe('pointsListModification', () => {
      // eslint-disable-next-line no-console
      console.log('pointsListModification fired');
      this.getUserData();
    });
    //    this.eventSubscriber = this.eventManager.subscribe('preferencesListModification', () => this.getUserData());
    //    this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', () => this.getUserData());
    //    this.eventSubscriber = this.eventManager.subscribe('weightListModification', () => this.getUserData());
  }

  getUserData(): void {
    // eslint-disable-next-line no-console
    console.log('call to getUserData');
    // Get points for the current week
    this.pointsService.thisWeek().subscribe((points: any) => {
      points = points.body;
      // eslint-disable-next-line no-console
      console.log('points ' + points.points);
      this.pointsThisWeek = points;
      this.pointsPercentage = (points.points / 21) * 100;
    });

    /*
     this.preferencesService.user().subscribe((preferences: any) => {
        this.preferences = preferences.body;
     });
     */
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
