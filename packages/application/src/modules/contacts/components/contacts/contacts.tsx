import { observer } from 'mobx-react';
import {
    BodyText,
    Button,
    Form,
    Stack,
    TableColumn,
    TableRowProps,
} from '@servicetitan/design-system';
import { cloneElement, Fragment, ReactElement, SyntheticEvent } from 'react';
import { useDependencies } from '@servicetitan/react-ioc';
import { Table } from '@servicetitan/table';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { ContactsStore } from '../../stores/contacts.store';
import { LoadStatus } from '../../../common/enums/load-status';
import { CenteredSpinner } from '../../../common/components/centered-spinner/centered-spinner';
import { AddContactTakeover } from '../add-contact-takeover/add-contact-takeover';
import { NameCell } from './name-cell';
import * as Styles from './contacts.module.less';
import { SomethingWentWrong } from '../../../common/components/something-went-wrong/something-went-wrong';

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

    const dataExists = contactsLoadStatus === LoadStatus.Ok && !!contactsTableState?.data.length;

    if (contactsLoadStatus === LoadStatus.Error) {
        return <SomethingWentWrong />;
    }

    return (
        <Fragment>
            <Stack direction="column" className={Styles.container}>
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
                        {dataExists && (
                            <Button primary onClick={showTakeover}>
                                Ավելացնել նոր կոնտակտ
                            </Button>
                        )}
                    </Stack>
                </Stack>
                {contactsLoadStatus === LoadStatus.Loading ? (
                    <CenteredSpinner />
                ) : dataExists ? (
                    <Table tableState={contactsTableState} rowRender={rowRender}>
                        <TableColumn field="name" title="Անուն" cell={NameCell} />
                        <TableColumn field="phoneNumber" title="Հեռախոսահամար" />
                        <TableColumn field="email" title="Էլեկտրոնային հասցե" />
                    </Table>
                ) : (
                    <EmptyContactsPlaceholder />
                )}
            </Stack>
            {takeoverVisibility && <AddContactTakeover />}
        </Fragment>
    );
});

const EmptyContactsPlaceholder = () => {
    const [{ showTakeover }] = useDependencies(ContactsStore);

    return (
        <Stack alignItems="center" justifyContent="center" className="h-100">
            <Stack
                direction="column"
                spacing={1}
                style={{ height: '460px', width: '300px' }}
                justifyContent="center"
            >
                <img src={require('../../../common/assets/no-data-1.png')} />
                <BodyText className="ta-center m-t-2-i">
                    Այս պահին համակարգում գրանցված կոնտակտներ չկան
                </BodyText>
                <Button
                    primary
                    onClick={showTakeover}
                    style={{ width: '225px', marginLeft: '40px' }}
                    className="m-t-2-i"
                >
                    + Ավելացնել կոնտակտ
                </Button>
            </Stack>
        </Stack>
    );
};
