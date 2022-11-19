import { observer } from 'mobx-react';
import { Button, ButtonGroup, Divider, Form, Page, Stack } from '@servicetitan/design-system';
import { FilePicker } from '../../common/components/file-picker/file-picker';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { FilePickerStore } from '../../common/stores/file-picker.store';
import { Label } from '@servicetitan/form';
import { AccountStore } from '../stores/account.store';
import * as Styles from './account.module.less';

export const Account = provide({
    singletons: [FilePickerStore, AccountStore],
})(
    observer(() => {
        const [{ form }] = useDependencies(AccountStore);
        const {
            $: { name, email, phoneNumber },
        } = form;

        return (
            <Page footer={<Footer />}>
                <Stack direction="column" className={Styles.main}>
                    <FilePicker
                        buttonProps={{
                            buttonLabel: 'Կցել լուսանկար',
                            typesNote: '',
                        }}
                    />
                    <Divider spacing="5" />
                    <Form className={Styles.form}>
                        {/* image upload here*/}

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
                    </Form>
                </Stack>
            </Page>
        );
    })
);

const Footer = () => {
    const [{ resetForm, isDirty, handleAccountUpdate }] = useDependencies(AccountStore);

    return (
        <div className="m-l-auto">
            <ButtonGroup>
                <Button small color="grey" onClick={resetForm} inactive={!isDirty}>
                    Չեղարկել
                </Button>
                <Button small primary onClick={handleAccountUpdate}>
                    Պահպանել փոփոխությունները
                </Button>
            </ButtonGroup>
        </div>
    );
};
