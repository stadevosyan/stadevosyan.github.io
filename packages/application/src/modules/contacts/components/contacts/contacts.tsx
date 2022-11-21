import { observer } from 'mobx-react';
import { Button, Form, Stack, TableColumn, TableRowProps } from '@servicetitan/design-system';
import { cloneElement, Fragment, ReactElement, SyntheticEvent } from 'react';
import { useDependencies } from '@servicetitan/react-ioc';
import { Table } from '@servicetitan/table';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { ContactsStore } from '../../stores/contacts.store';
import { LoadStatus } from '../../../common/enums/load-status';
import { CenteredSpinner } from '../../../common/components/centered-spinner/centered-spinner';
import { AddContactTakeover } from '../add-contact-takeover/add-contact-takeover';

export const Contacts = observer(() => {
    const [
        {
            searchDebounced,
            filterFormState,
            contactsTableState,
            contactsLoadStatus,
            showTakeover,
            takeoverVisibility,
        },
    ] = useDependencies(ContactsStore);

    const {
        $: { searchField },
    } = filterFormState;

    const handleSearch = (event: SyntheticEvent<HTMLInputElement>, data: { value: string }) => {
        searchDebounced(data.value);
        searchField.onChangeHandler(event, data);
    };
    const history = useHistory();
    const rowRender = (row: ReactElement<HTMLTableRowElement>, tableRowProps: TableRowProps) => {
        const rowProps = {
            ...row.props,
            className: classNames(row.props.className, 'cursor-pointer'),
            onClick: () => {
                history.push(`/contacts/${tableRowProps.dataItem.id}`);
            },
            disabled: true,
        };

        return cloneElement(row, { ...rowProps }, row.props.children);
    };

    return (
        <Fragment>
            <Stack direction="column" className="p-3">
                <Stack direction="column" className="filters p-b-3">
                    <Stack justifyContent="space-between" alignItems="center">
                        <Stack alignItems="center">
                            <Form.Input
                                style={{ width: '354px' }}
                                className="m-b-0 p-r-2"
                                placeholder="Որոնել"
                                onChange={handleSearch}
                            />
                        </Stack>

                        <Button primary onClick={showTakeover}>
                            Ավելացնել նոր կոնտակտ
                        </Button>
                    </Stack>
                </Stack>
                {contactsLoadStatus === LoadStatus.Loading ? (
                    <CenteredSpinner />
                ) : (
                    <Table tableState={contactsTableState} rowRender={rowRender}>
                        <TableColumn field="name" title="Անուն" />
                        <TableColumn field="phoneNumber" title="Հեռախոսահամար" />
                        <TableColumn field="email" title="Էլեկտրոնային հասցե" />
                    </Table>
                )}
            </Stack>
            {takeoverVisibility && <AddContactTakeover />}
        </Fragment>
    );
});
