import { provide, useDependencies } from '@servicetitan/react-ioc';
import { observer } from 'mobx-react';
import { Button, ButtonGroup, Form, Takeover } from '@servicetitan/design-system';
import { Label } from '@servicetitan/form';
import { useEffect } from 'react';
import * as Styles from './add-contact-takeover.module.less';
import { FilePickerStore } from '../../../common/stores/file-picker.store';
import { AddContactStore } from '../../stores/add-contact.store';
import { ContactsStore } from '../../stores/contacts.store';
import { FilePicker } from '../../../common/components/file-picker/file-picker';
import { LoadStatus } from '../../../common/enums/load-status';

export const AddContactTakeover = provide({
    singletons: [AddContactStore, FilePickerStore],
})(
    observer(() => {
        const [{ hideTakeover }, { form }] = useDependencies(ContactsStore, AddContactStore);
        const {
            $: { name, password, phoneNumber, email },
        } = form;

        useEffect(() => {
            const elements = document.getElementsByClassName('BackLink__label');
            if (elements.length) {
                elements[0].textContent = 'Վերադառնալ գլխավոր էջ';
            }
        }, []);

        return (
            <Takeover
                backLabel="Վերադառնալ գլխավոր էջ"
                onBack={hideTakeover}
                footer={<TakeoverFooter />}
                title="Ավելացնել նոր կոնտակտ"
                onClose={hideTakeover}
                theme="dark"
                className={Styles.takeover}
            >
                <div style={{ maxWidth: '800px' }} className="m-l-auto m-r-auto m-t-6">
                    <FilePicker
                        buttonProps={{
                            buttonLabel: 'Կցել լուսանկար',
                            typesNote: '',
                        }}
                        className="m-b-3"
                    />
                    <Form className={Styles.form}>
                        <Form.Input
                            label={<Label label="Անուն Ազգանուն" hasError={name.hasError} />}
                            value={name.value}
                            onChange={name.onChangeHandler}
                            error={name.error}
                        />

                        <Form.Input
                            label={<Label label="Էլեկտրոնային հասցե" hasError={email.hasError} />}
                            value={email.value}
                            onChange={email.onChangeHandler}
                            error={email.error}
                        />

                        <Form.Input
                            label={<Label label="Հեռախոսահամար" hasError={phoneNumber.hasError} />}
                            value={phoneNumber.value}
                            onChange={phoneNumber.onChangeHandler}
                            error={phoneNumber.error}
                        />

                        <Form.Input
                            label={<Label label="Ստեղծել գաղտնաբառ" hasError={password.hasError} />}
                            value={password.value}
                            onChange={password.onChangeHandler}
                            error={password.error}
                            type="password"
                        />
                    </Form>
                </div>
            </Takeover>
        );
    })
);

const TakeoverFooter = () => {
    const [{ addContact, addContactStatus, isDirty }, { hideTakeover }] = useDependencies(
        AddContactStore,
        ContactsStore
    );

    useEffect(() => {
        if (addContactStatus === LoadStatus.Ok) {
            hideTakeover();
        }
    }, [addContactStatus, hideTakeover]);

    return (
        <div className="m-l-auto">
            <ButtonGroup>
                <Button small color="grey" onClick={hideTakeover}>
                    Չեղարկել
                </Button>
                <Button
                    small
                    primary
                    onClick={addContact}
                    loading={addContactStatus === LoadStatus.Loading}
                    disabled={!isDirty}
                >
                    Ավելացնել
                </Button>
            </ButtonGroup>
        </div>
    );
};
