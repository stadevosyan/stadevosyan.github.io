import {
    Avatar,
    BodyText,
    Card,
    Icon,
    Layout,
    Page,
    Sidebar,
    SideNav,
    Stack,
} from '@servicetitan/design-system';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import * as Styles from './main-wrapper.module.less';

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

const setActive = (_int: number) => {};
const active = getRandomInt(5);

export const MainWrapper: FC = ({ children }) => {
    return (
        <Page
            maxWidth="wide"
            style={{ height: '100%' }}
            actionToolbar={{
                sticky: true,
                content: (
                    <Stack style={{ flex: 1 }} justifyContent="space-between">
                        <Stack.Item>{/*  */}</Stack.Item>
                        <Stack justifyContent="center" alignItems="center">
                            <Avatar name="ԹՀ" autoColor />
                            <BodyText className="p-l-1 t-truncate" size="medium">
                                Թամարա Հարությունյան
                            </BodyText>
                        </Stack>
                    </Stack>
                ),
            }}
            sidebar={
                <Sidebar localStorageKey="">
                    <Icon iconName="odometer" />
                    <Sidebar.Section>
                        <SideNav>
                            <SideNav.Item>
                                <Link to="/users">Բոլոր գրքերը</Link>
                            </SideNav.Item>
                            <SideNav.Item>
                                <Link to="/admin">Կոնտակտներ</Link>
                            </SideNav.Item>
                        </SideNav>
                    </Sidebar.Section>
                    <Sidebar.Section>
                        <Card onClick={() => setActive(4)} active={active === 4}>
                            <SideNav>
                                <SideNav.Item onClick={() => setActive(3)} active={active === 3}>
                                    Իմ հաշիվը
                                </SideNav.Item>
                            </SideNav>
                        </Card>
                    </Sidebar.Section>
                </Sidebar>
            }
        >
            <Layout>{children}</Layout>
        </Page>
    );
};
