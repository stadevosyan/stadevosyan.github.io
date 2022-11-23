import { Stack, TableColumn } from '@servicetitan/design-system';
import { Table } from '@servicetitan/table';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { BookHistoryStore } from '../../stores/book-history.store';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { NameCell } from '../../../contacts/components/contacts/name-cell';
import { LoadStatus } from '../../../common/enums/load-status';

export const BookHistory = provide({ singletons: [BookHistoryStore] })(
    observer(() => {
        const [{ historyTableState, historyTableLoadStatus, init }] =
            useDependencies(BookHistoryStore);
        const { id } = useParams<{ id: string }>();

        useEffect(() => {
            init(+id);
        }, [id, init]);

        return (
            <Stack className="p-y-3">
                <Table
                    tableState={historyTableState}
                    loading={historyTableLoadStatus === LoadStatus.Loading}
                >
                    <TableColumn field="name" title="Անուն Ազգանուն" cell={NameCell} />
                    <TableColumn field="startDate" title="Վարձակալման ամսաթիվ" format="{0:d}" />
                    <TableColumn field="endDate" title="Վերադարձի ամսաթիվ" format="{0:d}" />
                </Table>
            </Stack>
        );
    })
);
