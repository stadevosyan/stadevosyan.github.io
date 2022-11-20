import { Button, ButtonGroup, Form, Modal } from '@servicetitan/design-system';
import { useDependencies } from '@servicetitan/react-ioc';
import { AccountStore } from '../stores/account.store';
import { ChangePasswordStore } from '../stores/change-password-store';
import { observer } from 'mobx-react';
import * as Styles from './account.module.less';
import { Label } from '@servicetitan/form';

export const ChangePasswordModal = () => {
    const [{ form, handleChangePassword, changePasswordStatus }, { setModalOpen }] =
        useDependencies(ChangePasswordStore, AccountStore);
    const {
        $: { oldPassword, newPasswordForm },
    } = form;

    const {
        $: { newPassword, passwordConfirmation },
    } = newPasswordForm;

    const handleClose = () => {
        setModalOpen(false);
    };

    return (
        <Modal open title="Փոխել գաղտնաբառը" onClose={handleClose} footer={<Footer />}>
            <Form>
                <Form.Input
                    label={<Label label="Հին գաղտնաբառը" hasError={oldPassword.hasError} />}
                    value={oldPassword.value}
                    onChange={oldPassword.onChangeHandler}
                    error={oldPassword.error}
                />

                <Form.Input
                    label={
                        <Label
                            label="Նոր գաղտնաբառը"
                            hasError={!!(newPassword.error ?? newPasswordForm.error)}
                        />
                    }
                    value={newPassword.value}
                    onChange={newPassword.onChangeHandler}
                    error={newPassword.error ?? newPasswordForm.error}
                    disabled
                />

                <Form.Input
                    label={
                        <Label
                            label="Կրկնել նոր գաղտնաբառը"
                            hasError={!!(passwordConfirmation.hasError ?? newPasswordForm.error)}
                        />
                    }
                    value={passwordConfirmation.value}
                    onChange={passwordConfirmation.onChangeHandler}
                    error={passwordConfirmation.hasError ?? newPasswordForm.error}
                />
            </Form>
        </Modal>
    );
};

const Footer = observer(() => {
    const [{ isDirty }, { setModalOpen, handleAccountUpdate }] = useDependencies(
        ChangePasswordStore,
        AccountStore
    );
    const handleClose = () => {
        setModalOpen(false);
    };
    return (
        <ButtonGroup>
            <Button onClick={handleClose}>Չեղարկել</Button>
            <Button onClick={handleAccountUpdate} primary disabled={!isDirty}>
                Պահպանել
            </Button>
        </ButtonGroup>
    );
});
