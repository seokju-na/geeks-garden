import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ApiErrorCodes, ApiErrorMessage, EnterExistingGithubAccessTokenPayload } from '../../../../core/api';
import { ApiService } from '../../../shared/services/api-service';

@Component({
  selector: 'gg-token-authorize-form',
  templateUrl: './token-authorize-form.html',
  styleUrls: ['./token-authorize-form.scss'],
})
export class TokenAuthorizeForm implements AfterViewInit {
  readonly form = new FormGroup({
    token: new FormControl('', [Validators.required]),
  });

  @ViewChild('tokeInput', { static: false }) tokenInput?: ElementRef<HTMLInputElement>;

  get submitting() {
    return this._submitting;
  }

  get showErrorMessage() {
    return this._showErrorMessage;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  private _submitting = false;
  private _showErrorMessage = false;
  private _errorMessage: string;

  constructor(
    private readonly api: ApiService,
    private readonly ngZone: NgZone,
  ) {
  }

  ngAfterViewInit() {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      if (this.tokenInput) {
        this.tokenInput.nativeElement.focus();
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid || this._submitting) {
      return;
    }

    const value = this.form.value;
    const payload: EnterExistingGithubAccessTokenPayload = {
      token: value.token,
    };

    this._submitting = true;

    try {
      await this.api.enterExistingGithubAccessToken(payload);
    } catch (error) {
      this.handleError(error);
    } finally {
      this._submitting = false;
    }
  }

  private handleError(error: unknown) {
    if (error && (error as any).code) {
      const { code } = error as ApiErrorMessage;

      switch (code) {
        case ApiErrorCodes.UNAUTHORIZED:
          this._errorMessage = 'Invalid token.';
          this._showErrorMessage = true;
          break;
        case ApiErrorCodes.UNHANDLED:
        default:
          this.showUnhandledErrorMessage(error);
          break;
      }
    } else {
      this.showUnhandledErrorMessage(error);
    }
  }

  private showUnhandledErrorMessage(error: any) {
    this._errorMessage = 'Cannot handle error. Try again.';
    this._showErrorMessage = true;

    this.api.logException(error);
  }
}
