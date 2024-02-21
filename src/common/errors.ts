export const enum ErrorsSlug {
    CredentialProviderMismatch = 'credential_provider_mismatch',
    UserDoesNotExist = 'user_does_not_exist',
    UserAlreadyExist = 'user_already_exist',
    IncorrectPassword = 'incorrect_password',
    SystemError = 'system_error',
}

type ErrorMapType = Record<ErrorsSlug, { error: string; message: string }>;

export const ErrorMap: ErrorMapType = {
    [ErrorsSlug.CredentialProviderMismatch]: {
        error: 'Invalid Provider SignIn',
        message: '',
    },
    [ErrorsSlug.UserDoesNotExist]: {
        error: 'User does not exist',
        message: 'Please signin with the correct email',
    },
    [ErrorsSlug.UserAlreadyExist]: {
        error: 'User already exist',
        message: 'User already exists, signin with a different account',
    },
    [ErrorsSlug.IncorrectPassword]: {
        error: 'Incorrect Password',
        message: 'Please enter correct password',
    },
    [ErrorsSlug.SystemError]: {
        error: 'System error. Please contact support',
        message: '',
    },
};
