import { BodyText, Stack, TableColumn } from '@servicetitan/design-system';
import { Table } from '@servicetitan/table';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { BookHistoryStore } from '../../stores/book-history.store';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { Fragment, useEffect } from 'react';

import { NameCell } from '../../../contacts/components/contacts/name-cell';
import { LoadStatus } from '../../../common/enums/load-status';
import { CenteredSpinner } from '../../../common/components/centered-spinner/centered-spinner';

export const BookHistory = provide({ singletons: [BookHistoryStore] })(
    observer(() => {
        const [{ historyTableState, historyTableLoadStatus, historyRecordsExists, init }] =
            useDependencies(BookHistoryStore);
        const { id } = useParams<{ id: string }>();

        useEffect(() => {
            const elements = document.getElementsByClassName('Modal__header-title');
            if (elements.length) {
                elements[0].textContent = 'Ջնջել';
            }
        }, []);

        useEffect(() => {
            init(+id);
        }, [id, init]);

        const loading = historyTableLoadStatus === LoadStatus.Loading;

        return (
            <Fragment>
                {loading && (
                    <Stack alignItems="center" justifyContent="center" className="h-100 w-100">
                        <CenteredSpinner />
                    </Stack>
                )}
                {!loading &&
                    (!historyRecordsExists ? (
                        <Stack alignItems="center" justifyContent="center" className="h-100 w-100">
                            <Stack
                                direction="column"
                                spacing={1}
                                style={{ height: '460px', width: '300px' }}
                                justifyContent="center"
                            >
                                <img src={require('../../../common/assets/no-data-2.png')} />
                                <BodyText className="ta-center m-t-2-i">
                                    Այս գիրքը դեռևս չի վարձակալվել
                                </BodyText>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack className="p-y-3">
                            <Table tableState={historyTableState} loading={loading}>
                                <TableColumn field="name" title="Անուն Ազգանուն" cell={NameCell} />
                                <TableColumn
                                    field="startDate"
                                    title="Վարձակալման ամսաթիվ"
                                    format="{0:d}"
                                />
                                <TableColumn
                                    field="endDate"
                                    title="Վերադարձի ամսաթիվ"
                                    format="{0:d}"
                                />
                            </Table>
                        </Stack>
                    ))}
            </Fragment>
        );
    })
);
