import {FormGroup} from '@angular/forms';

export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
        const password = group.controls[passwordKey];
        const confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
            return {
                mismatchedPasswords: true
            };
        }
        return {
            mismatchedPasswords: false
        };
    };
}
