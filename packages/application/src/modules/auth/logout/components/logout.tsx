import { useDependencies } from '@servicetitan/react-ioc';
import { AuthStore } from '../../../common/stores/auth.store';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthPaths } from '../../../common/utils/paths';

export const Logout = () => {
    const [{ logout }] = useDependencies(AuthStore);

    const history = useHistory();
    useEffect(() => {
        logout();
        history.push(AuthPaths.login);
    }, [logout, history]);

    return null;
};
