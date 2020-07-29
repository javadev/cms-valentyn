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
import { D3ChartService } from './d3-chart.service';

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
  bpReadings: any = {};
  bpOptions: any;
  bpData: any;

  options: any;
  data: any;

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
        this.setTestChart();
      }
    });
    this.registerAuthenticationSuccess();
  }

  setTestChart(): void {
    this.options = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55,
        },
        x(d: { label: any }): any {
          return d.label;
        },
        y(d: { label: any }): any {
          return d.label;
        },
        showValues: true,
        valueFormat(d: number): any {
          return d3.format(',.4f')(d);
        },
        duration: 500,
        xAxis: {
          axisLabel: 'X Axis',
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: -10,
        },
      },
    };

    this.data = [
      {
        key: 'Cumulative Return',
        values: [
          {
            label: 'Ab',
            value: 29,
          },
        ],
      },
    ];
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
      }); // end pointsService
      // Get blood pressure readings for the last 30 days
      this.bloodPressureService.last30Days().subscribe((bpReadings: any) => {
        bpReadings = bpReadings.body;
        this.bpReadings = bpReadings;
        // eslint-disable-next-line no-console
        console.log('bpReadings.length ' + this.bpReadings.readings.length);
        // https://stackoverflow.com/a/34694155/65681
        this.bpOptions = D3ChartService.getChartConfig();
        // eslint-disable-next-line no-console
        console.log('bpOptions ' + this.bpOptions);

        if (bpReadings.readings.length) {
          this.bpOptions.title.text = bpReadings.period;
          this.bpOptions.chart.yAxis.axisLabel = 'Blood Pressure';
          /* eslint-disable no-debugger */
          // debugger;
          /*
          bpReadings.readings.forEach((item: { date: string; }) => {
              // eslint-disable-next-line no-console
              console.log('x fisk=' + new Date(item.date));
          });
          */
          const systolics: any = [];
          const diastolics: any = [];
          const upperValues: any = [];
          const lowerValues: any = [];
          bpReadings.readings.forEach((item: { date: string; systolic: number; diastolic: number }) => {
            systolics.push({
              x: new Date(item.date),
              y: item.systolic,
              area: false,
            });
            diastolics.push({
              x: new Date(item.date),
              y: item.diastolic,
              area: false,
            });
            upperValues.push(item.systolic);
            lowerValues.push(item.diastolic);
          });
          this.bpData = [
            {
              values: systolics,
              key: 'Systolic',
              color: '#673ab7',
              area: false,
            },
            {
              values: diastolics,
              key: 'Diastolic',
              color: '#03a9f4',
              area: false, // area - set to true if you want this line to turn into a filled area chart.
            },
          ];
          // set y scale to be 10 more than max and min
          // eslint-disable-next-line no-console
          console.log('lowest value =' + Math.min(...lowerValues));
          this.bpOptions.chart.yDomain = [Math.min(...lowerValues) - 15, Math.max(...upperValues) + 15];
        } else {
          this.bpReadings.readings = [];
        }
      });
    });
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
