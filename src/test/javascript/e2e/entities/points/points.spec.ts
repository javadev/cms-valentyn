import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PointsComponentsPage, PointsDeleteDialog, PointsUpdatePage } from './points.page-object';

const expect = chai.expect;

describe('Points e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pointsComponentsPage: PointsComponentsPage;
  let pointsUpdatePage: PointsUpdatePage;
  let pointsDeleteDialog: PointsDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Points', async () => {
    await navBarPage.goToEntity('points');
    pointsComponentsPage = new PointsComponentsPage();
    await browser.wait(ec.visibilityOf(pointsComponentsPage.title), 5000);
    expect(await pointsComponentsPage.getTitle()).to.eq('twentyOnePointsApp.points.home.title');
    await browser.wait(ec.or(ec.visibilityOf(pointsComponentsPage.entities), ec.visibilityOf(pointsComponentsPage.noResult)), 1000);
  });

  it('should load create Points page', async () => {
    await pointsComponentsPage.clickOnCreateButton();
    pointsUpdatePage = new PointsUpdatePage();
    expect(await pointsUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.points.home.createOrEditLabel');
    await pointsUpdatePage.cancel();
  });

  it('should create and save Points', async () => {
    const nbButtonsBeforeCreate = await pointsComponentsPage.countDeleteButtons();

    await pointsComponentsPage.clickOnCreateButton();

    await promise.all([
      pointsUpdatePage.setDateInput('2000-12-31'),
      pointsUpdatePage.setExerciceInput('5'),
      pointsUpdatePage.setMealsInput('5'),
      pointsUpdatePage.setAlcoholInput('5'),
      pointsUpdatePage.setNotesInput('notes'),
      pointsUpdatePage.userSelectLastOption(),
    ]);

    expect(await pointsUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');
    expect(await pointsUpdatePage.getExerciceInput()).to.eq('5', 'Expected exercice value to be equals to 5');
    expect(await pointsUpdatePage.getMealsInput()).to.eq('5', 'Expected meals value to be equals to 5');
    expect(await pointsUpdatePage.getAlcoholInput()).to.eq('5', 'Expected alcohol value to be equals to 5');
    expect(await pointsUpdatePage.getNotesInput()).to.eq('notes', 'Expected Notes value to be equals to notes');

    await pointsUpdatePage.save();
    expect(await pointsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pointsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Points', async () => {
    const nbButtonsBeforeDelete = await pointsComponentsPage.countDeleteButtons();
    await pointsComponentsPage.clickOnLastDeleteButton();

    pointsDeleteDialog = new PointsDeleteDialog();
    expect(await pointsDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.points.delete.question');
    await pointsDeleteDialog.clickOnConfirmButton();

    expect(await pointsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
