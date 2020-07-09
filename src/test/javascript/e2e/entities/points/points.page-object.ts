import { element, by, ElementFinder } from 'protractor';

export class PointsComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-points div table .btn-danger'));
  title = element.all(by.css('jhi-points div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class PointsUpdatePage {
  pageTitle = element(by.id('jhi-points-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  dateInput = element(by.id('field_date'));
  exerciceInput = element(by.id('field_exercice'));
  mealsInput = element(by.id('field_meals'));
  alcoholInput = element(by.id('field_alcohol'));
  notesInput = element(by.id('field_notes'));

  userSelect = element(by.id('field_user'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async setExerciceInput(exercice: string): Promise<void> {
    await this.exerciceInput.sendKeys(exercice);
  }

  async getExerciceInput(): Promise<string> {
    return await this.exerciceInput.getAttribute('value');
  }

  async setMealsInput(meals: string): Promise<void> {
    await this.mealsInput.sendKeys(meals);
  }

  async getMealsInput(): Promise<string> {
    return await this.mealsInput.getAttribute('value');
  }

  async setAlcoholInput(alcohol: string): Promise<void> {
    await this.alcoholInput.sendKeys(alcohol);
  }

  async getAlcoholInput(): Promise<string> {
    return await this.alcoholInput.getAttribute('value');
  }

  async setNotesInput(notes: string): Promise<void> {
    await this.notesInput.sendKeys(notes);
  }

  async getNotesInput(): Promise<string> {
    return await this.notesInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class PointsDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-points-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-points'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
