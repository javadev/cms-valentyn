import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from 'app/shared/shared.module';
import { BloodPressureComponent } from './blood-pressure.component';
import { BloodPressureDetailComponent } from './blood-pressure-detail.component';
import { BloodPressureUpdateComponent } from './blood-pressure-update.component';
import { BloodPressureDeleteDialogComponent } from './blood-pressure-delete-dialog.component';
import { bloodPressureRoute } from './blood-pressure.route';

@NgModule({
  imports: [TwentyOnePointsSharedModule, RouterModule.forChild(bloodPressureRoute)],
  declarations: [BloodPressureComponent, BloodPressureDetailComponent, BloodPressureUpdateComponent, BloodPressureDeleteDialogComponent],
  entryComponents: [BloodPressureDeleteDialogComponent],
})
export class TwentyOnePointsBloodPressureModule {}
