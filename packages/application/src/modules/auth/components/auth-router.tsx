import { FC } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Login } from '../login/components/login';
import { Register } from '../register/components/register';
import { ForgotPassword } from '../forgot-password/forgot-password';

export const AuthRouter: FC = () => (
    <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />

        <Redirect from="/*" to="/login" />
    </Switch>
);
