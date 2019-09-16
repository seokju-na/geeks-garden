import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ApiErrorCodes, ApiErrorMessage, CreateGithubAccessTokenPayload } from '../../../../core/api';
import { ApiService } from '../../../shared/services/api-service';

@Component({
  selector: 'gg-create-github-token-form',
  templateUrl: './create-github-token-form.html',
  styleUrls: ['./create-github-token-form.scss'],
})
export class CreateGithubTokenForm implements AfterViewInit {
  readonly form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    code: new FormControl(null),
  });

  @ViewChild('usernameInput', { static: false }) usernameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('otpInput', { static: false }) otpInput?: ElementRef<HTMLInputElement>;

  get submitting() {
    return this._submitting;
  }

  get need2faCode() {
    return this._need2faCode;
  }

  set need2faCode(value: unknown) {
    this._need2faCode = coerceBooleanProperty(value);

    const control = this.form.get('code');

    if (this._need2faCode) {
      control.setValidators([
        Validators.required,
        Validators.pattern(/\d{6}/),
      ]);
      control.setValue('');
    } else {
      control.clearValidators();
      control.setValue(null);
    }
  }

  get showErrorMessage() {
    return this._showErrorMessage;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  private _submitting = false;
  private _need2faCode = false;
  private _showErrorMessage = false;
  private _errorMessage: string;

  constructor(
    private readonly api: ApiService,
    private readonly ngZone: NgZone,
  ) {
  }

  ngAfterViewInit() {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      if (this.usernameInput) {
        this.usernameInput.nativeElement.focus();
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid || this._submitting) {
      return;
    }

    const value = this.form.value;
    const payload: CreateGithubAccessTokenPayload = {
      username: value.username,
      password: value.password,
    };

    if (value.code != null) {
      payload.code = value.code;
    }

    this._submitting = true;

    try {
      await this.api.createGithubAccessToken(payload);
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
          this._errorMessage = 'Username of password is incorrect.';
          this._showErrorMessage = true;
          break;
        case ApiErrorCodes.REQUIRED_2FA:
          // Note that api throws same error if otp code is invalid.
          if (this._need2faCode) {
            this._errorMessage = 'Invalid otp code.';
            this._showErrorMessage = true;
          } else {
            this._showErrorMessage = false;
            this.need2faCode = true;
          }

          this.focusOtpInputWhenReady();
          break;
        case ApiErrorCodes.GITHUB_VALIDATION_FAILED:
          this._errorMessage = 'Token already exists.';
          this._showErrorMessage = true;
          break;
        case ApiErrorCodes.UNHANDLED:
        default:
          this.showUnhandledErrorMessage(error);
      }
    } else {
      this.showUnhandledErrorMessage(error);
    }
  }

  private focusOtpInputWhenReady() {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      if (this.otpInput) {
        this.otpInput.nativeElement.focus();
      }
    });
  }

  private showUnhandledErrorMessage(error: any) {
    this._errorMessage = 'Cannot handle error. Try again.';
    this._showErrorMessage = true;

    this.api.logException(error);
  }
}
