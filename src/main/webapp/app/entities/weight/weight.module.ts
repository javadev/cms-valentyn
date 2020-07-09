import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from 'app/shared/shared.module';
import { WeightComponent } from './weight.component';
import { WeightDetailComponent } from './weight-detail.component';
import { WeightUpdateComponent } from './weight-update.component';
import { WeightDeleteDialogComponent } from './weight-delete-dialog.component';
import { weightRoute } from './weight.route';

@NgModule({
  imports: [TwentyOnePointsSharedModule, RouterModule.forChild(weightRoute)],
  declarations: [WeightComponent, WeightDetailComponent, WeightUpdateComponent, WeightDeleteDialogComponent],
  entryComponents: [WeightDeleteDialogComponent],
})
export class TwentyOnePointsWeightModule {}
