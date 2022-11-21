import { observer } from 'mobx-react';
import { Button, Form, Stack, TableColumn } from '@servicetitan/design-system';
import { Fragment, SyntheticEvent } from 'react';
import { useDependencies } from '@servicetitan/react-ioc';
import { LoadStatus } from '../../common/enums/load-status';
import { CenteredSpinner } from '../../common/components/centered-spinner/centered-spinner';
import { Table } from '@servicetitan/table';
import { ContactsStore } from '../stores/contacts.store';
import { AddContactTakeover } from './add-contact-takeover';

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

    return (
        <Fragment>
            <Stack direction="column" className="p-3">
                <Stack direction="column" className="filters p-b-3">
                    <Stack justifyContent="space-between" alignItems="center">
                        <Stack alignItems="center">
                            <Form.Input
                                style={{ width: '354px' }}
                                className="m-b-0 p-r-2"
                                placeholder="Որոնել գրքեր"
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
                    <Table tableState={contactsTableState}>
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
