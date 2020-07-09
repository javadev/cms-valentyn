import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BloodPressureComponentsPage, BloodPressureDeleteDialog, BloodPressureUpdatePage } from './blood-pressure.page-object';

const expect = chai.expect;

describe('BloodPressure e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bloodPressureComponentsPage: BloodPressureComponentsPage;
  let bloodPressureUpdatePage: BloodPressureUpdatePage;
  let bloodPressureDeleteDialog: BloodPressureDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BloodPressures', async () => {
    await navBarPage.goToEntity('blood-pressure');
    bloodPressureComponentsPage = new BloodPressureComponentsPage();
    await browser.wait(ec.visibilityOf(bloodPressureComponentsPage.title), 5000);
    expect(await bloodPressureComponentsPage.getTitle()).to.eq('twentyOnePointsApp.bloodPressure.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(bloodPressureComponentsPage.entities), ec.visibilityOf(bloodPressureComponentsPage.noResult)),
      1000
    );
  });

  it('should load create BloodPressure page', async () => {
    await bloodPressureComponentsPage.clickOnCreateButton();
    bloodPressureUpdatePage = new BloodPressureUpdatePage();
    expect(await bloodPressureUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.bloodPressure.home.createOrEditLabel');
    await bloodPressureUpdatePage.cancel();
  });

  it('should create and save BloodPressures', async () => {
    const nbButtonsBeforeCreate = await bloodPressureComponentsPage.countDeleteButtons();

    await bloodPressureComponentsPage.clickOnCreateButton();

    await promise.all([
      bloodPressureUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      bloodPressureUpdatePage.setSystolicInput('5'),
      bloodPressureUpdatePage.setDiastolicInput('5'),
      bloodPressureUpdatePage.userSelectLastOption(),
    ]);

    expect(await bloodPressureUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');
    expect(await bloodPressureUpdatePage.getSystolicInput()).to.eq('5', 'Expected systolic value to be equals to 5');
    expect(await bloodPressureUpdatePage.getDiastolicInput()).to.eq('5', 'Expected diastolic value to be equals to 5');

    await bloodPressureUpdatePage.save();
    expect(await bloodPressureUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bloodPressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last BloodPressure', async () => {
    const nbButtonsBeforeDelete = await bloodPressureComponentsPage.countDeleteButtons();
    await bloodPressureComponentsPage.clickOnLastDeleteButton();

    bloodPressureDeleteDialog = new BloodPressureDeleteDialog();
    expect(await bloodPressureDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.bloodPressure.delete.question');
    await bloodPressureDeleteDialog.clickOnConfirmButton();

    expect(await bloodPressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
