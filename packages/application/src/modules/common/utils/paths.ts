export const AuthPaths: Record<string, string> = {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
};

export const PrivatePaths: Record<string, string> = {
    books: '/',
    bookById: '/:id',
    account: '/account',
    contacts: '/contacts',
};
