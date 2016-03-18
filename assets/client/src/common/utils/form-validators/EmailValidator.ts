import {Control} from 'angular2/common';

export function EmailValidator(c: Control): { [key: string]: any } {
    var email = c.value;
    if (!email) {
        return { invalidEmail: true };
    }
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var validationResult = re.test(email);
    if (!validationResult) {
        return { invalidEmail: true };
    }
}