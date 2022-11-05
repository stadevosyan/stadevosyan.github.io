import { FC } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Login } from '../login/components/login';
import { Register } from '../register/components/register';
import { ForgotPassword } from '../forgot-password/components/forgot-password';
import { AuthPaths } from '../../common/utils/paths';

export const AuthRouter: FC = () => (
    <Switch>
        <Route path={AuthPaths.login} component={Login} />
        <Route path={AuthPaths.register} component={Register} />
        <Route path={AuthPaths.forgotPassword} component={ForgotPassword} />

        <Redirect from="/*" to={AuthPaths.login} />
    </Switch>
);
