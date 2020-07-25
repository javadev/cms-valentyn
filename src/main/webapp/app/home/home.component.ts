import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { PointsService } from 'app/entities/points/points.service';
import { BloodPressureService } from 'app/entities/blood-pressure/blood-pressure.service';
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
  preferences: Preferences = new Preferences();

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private pointsService: PointsService,
    private preferencesService: PreferencesService,
    private eventManager: JhiEventManager,
    private bloodPressureService: BloodPressureService
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
    this.authSubscription = this.eventManager.subscribe('preferencesListModification', () => this.getUserData());
    //    this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', () => this.getUserData());
    //    this.eventSubscriber = this.eventManager.subscribe('weightListModification', () => this.getUserData());
  }

  getUserData(): void {
    // eslint-disable-next-line no-console
    console.log('call to getUserData');
    // Get preferences
    this.preferencesService.user().subscribe((preferences: any) => {
      this.preferences = preferences.body;
      // eslint-disable-next-line no-console
      console.log('preferences.weeklyGoal ' + this.preferences.weeklyGoal);

      // Get points for the current week
      this.pointsService.thisWeek().subscribe((points: any) => {
        points = points.body;

        this.pointsThisWeek = points;
        this.pointsPercentage = (points.points / 21) * 100;
        // calculate success, warning, or danger
        if (points.points >= preferences.weeklyGoal) {
          this.pointsThisWeek.progress = 'success';
        } else if (points.points < 10) {
          this.pointsThisWeek.progress = 'danger';
        } else if (points.points >= 10 && this.preferences.weeklyGoal != null && points.points < this.preferences.weeklyGoal) {
          this.pointsThisWeek.progress = 'warning';
        }
      });
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
