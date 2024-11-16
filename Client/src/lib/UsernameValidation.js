import { isValidUsername } from '6pp'


export const UsernameValidation = (Username) => {
    if (!isValidUsername(Username)) {
        return { isValid: false, errorMessage: "Username is Invalid" };
    }
}
