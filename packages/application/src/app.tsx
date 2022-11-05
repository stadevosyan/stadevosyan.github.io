import { FC, StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';

import { Stack } from '@servicetitan/design-system';

import { Placeholder } from './modules/common/components/placeholder';

import * as Styles from './app.module.css';

export const App: FC = () => (
    <StrictMode>
        <HashRouter>
            <Stack alignItems="center" justifyContent="center" className={Styles.app}>
                <Placeholder />
            </Stack>
        </HashRouter>
    </StrictMode>
);
