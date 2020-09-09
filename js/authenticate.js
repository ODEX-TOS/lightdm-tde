class Authenticate {
	constructor() {
		this._passwordBox = document.querySelector('#input-password-box');
		this._passwordInput = document.querySelector('#input-password');
		this._buttonAuthenticate = document.querySelector('#button-authenticate');
		this._passwordInputContainer = document.querySelector('#input-password-container');
		this._tooltipPassword = document.querySelector('#tooltip-password');
		this._password = '';
		this._init();
	}

	_returnRandomErrorMessages() {
		const errorMessages = [
			'Authentication failed!',
			'This incident will be reported.',
            "That doesn't look quite right!"
		];
		return errorMessages[Math.floor(Math.random() * errorMessages.length)];	
	}

	_returnRandomSuccessfulMessages() {
		const errorMessages = [
			'Authentication success! Logging in!',
			'Logging in!',
			'Looking good today',
			'You are someone\'s reason to smile.',
		];
		return errorMessages[Math.floor(Math.random() * errorMessages.length)];
	}

	startAuthentication() {
			lightdm.cancel_authentication();
			lightdm.authenticate(String(accounts.getDefaultUserName()));
	}

	// Timer expired, create new authentication session
	_autologinTimerExpired() {
		window.autologin_timer_expired = () => {
			this.startAuthentication();
		};
	}

	// Authentication completed callback
	_authenticationComplete() {
		window.authentication_complete = () => {
			if (lightdm.is_authenticated) {
				this._authenticationSuccess();
			} else {
				this._authenticationFailed();
			}
		};
	}

	// You passed to authentication
	_authenticationSuccess() {
		// Success messages
		this._passwordBox.classList.add('authentication-success');
		this._tooltipPassword.innerText = this._returnRandomSuccessfulMessages();
		this._tooltipPassword.classList.add('tooltip-success');

		// Add a delay before unlocking
		setTimeout(
			() => {
				this._buttonAuthenticate.classList.remove('authentication-success');
				lightdm.start_session_sync(String(sessions.getDefaultSession()));
				this._tooltipPassword.classList.remove('tooltip-success');
			},
			1500
		);
	}

	// Remove authentication failure messages
	_authFailedRemove() {
		// Remove warnings and tooltip
		if ((!this._passwordBox.classList.contains('authentication-failed')) &&
				(!this._tooltipPassword.classList.contains('tooltip-error'))) {
			return;
		}
		setTimeout(
			() => {
				this._tooltipPassword.classList.remove('tooltip-error');
				this._passwordBox.classList.remove('authentication-failed');
			},
			250
		);
	}

	// You failed to authenticate
	_authenticationFailed() {
		// New authentication session
		this.startAuthentication();
		this._passwordInput.value = '';

		// Error messages/UI
		this._passwordBox.classList.add('authentication-failed');
		this._tooltipPassword.innerText = this._returnRandomErrorMessages();
		this._tooltipPassword.classList.add('tooltip-error');

		// Shake animation
		this._passwordInputContainer.classList.add('shake');
		setTimeout(
			() => {
				// Stop shaking
				this._passwordInputContainer.classList.remove('shake');
			},
			500
		);
	}

	// Register keyup event
	_buttonAuthenticateClickEvent() {
		this._buttonAuthenticate.addEventListener(
			'click',
			() => {
				// Save input value to variable
				this._password = this._passwordInput.value;
				if (this._password.length < 1) {
					return;
				}
				
				// Validation
				lightdm.respond(String(this._password));
			}
		);
	}

	// Register keydown event
	_passwordInputKeyDownEvent() {
		this._passwordInput.addEventListener(
			'keydown',
			e => {
				this._authFailedRemove();
				this._password = this._passwordInput.value;
				if (e.key === 'Enter') {
					if (this._password.length < 1) {
						return;
					}
					lightdm.respond(String(this._password));
				}
			}
		);
	}

	_init() {
		this._autologinTimerExpired();
		this._authenticationComplete();
		this._buttonAuthenticateClickEvent();
		this._passwordInputKeyDownEvent();
		if (!lightdm) {
			lightdm.onload = function() {
				console.log('Start authentication');
				this.startAuthentication();
			};
		} else {
			console.log('Start authentication');
			this.startAuthentication();
		}
	}
}
