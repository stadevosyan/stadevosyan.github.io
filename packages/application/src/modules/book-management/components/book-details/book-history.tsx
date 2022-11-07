import { Stack, Table, TableColumn } from '@servicetitan/design-system';
import { useState } from 'react';

export const BookHistory = () => {
    const [pageState, setPageState] = useState({ skip: 0, take: 3 });
    return (
        <Stack className="p-y-3">
            <Table
                pageable
                skip={pageState.skip}
                take={pageState.take}
                onPageChange={e => setPageState(e.page)}
                data={[
                    {
                        id: 1,
                        name: 'Անի Հակոբյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 2,
                        name: 'Անի Հակոբյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 3,
                        name: 'Անի Հակոբյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 4,
                        name: 'Թամարա Հակոբյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 5,
                        name: 'Անի Հակոբյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 6,
                        name: 'Անի Հակոբյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 7,
                        name: 'Թամարա Հարությունյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 8,
                        name: 'Թամարա Հարությունյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                    {
                        id: 9,
                        name: 'Թամարա Հարությունյան',
                        startDate: new Date(1876, 3, 27),
                        endDate: new Date(1876, 3, 27),
                    },
                ]}
            >
                <TableColumn field="name" title="Անուն Ազգանուն" />
                <TableColumn field="startDate" title="Վարձակալման ամսաթիվ" format="{0:d}" />
                <TableColumn field="endDate" title="Վերադարձի ամսաթիվ" format="{0:d}" />
            </Table>
        </Stack>
    );
};
