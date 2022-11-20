import { observer } from 'mobx-react';
import { Button, Form, Stack, Table, TableColumn } from '@servicetitan/design-system';
import { useState } from 'react';

export const Contacts = observer(() => {
    const [pageState, setPageState] = useState({ skip: 0, take: 3 });

    return (
        <Stack direction="column" className="p-3">
            <Stack direction="column" className="filters p-b-3">
                <Stack justifyContent="space-between" alignItems="center">
                    <Stack alignItems="center">
                        <Form.Input
                            style={{ width: '354px' }}
                            className="m-b-0 p-r-2"
                            placeholder="Որոնել գրքեր"
                        />
                    </Stack>

                    <Button primary onClick={() => {}}>
                        Ավելացնել նոր կոնտակտ
                    </Button>
                </Stack>
            </Stack>
            <Table
                pageable
                skip={pageState.skip}
                take={pageState.take}
                onPageChange={e => setPageState(e.page)}
                data={[
                    {
                        id: 1,
                        name: 'Անի Հակոբյան',
                        email: 'myemail@email.com',
                        phone: '95444444',
                    },
                    {
                        id: 2,
                        name: 'Անի Հակոբյան',
                        email: 'myemail@email.com',
                        phone: '95444444',
                    },
                    {
                        id: 3,
                        name: 'Անի Հակոբյան',
                        email: 'myemail@email.com',
                        phone: '95444444',
                    },
                    {
                        id: 4,
                        name: 'Թամարա Հակոբյան',
                        email: 'myemail@email.com',
                        phone: '95444444',
                    },
                    {
                        id: 5,
                        name: 'Անի Հակոբյան',
                        email: 'myemail@email.com',
                        phone: '95444444',
                    },
                    {
                        id: 6,
                        name: 'Անի Հակոբյան',
                        email: 'myemail@email.com',
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 7,
                        name: 'Թամարա Հարությունյան',
                        email: 'myemail@email.com',
                        phone: '95444444',
                    },
                    {
                        id: 8,
                        name: 'Թամարա Հարությունյան',
                        email: 'myemail@email.com',
                        phone: '95444444',
                    },
                    {
                        id: 9,
                        name: 'Թամարա Հարությունյան',
                        email: 'myemail@email.com',
                        phone: '95444444',
                    },
                ]}
            >
                <TableColumn field="name" title="Անուն" />
                <TableColumn field="phone" title="Հեռախոսահամար" />
                <TableColumn field="email" title="Էլեկտրոնային հասցե" />
            </Table>
        </Stack>
    );
});
