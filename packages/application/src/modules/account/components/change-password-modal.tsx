import { Button, ButtonGroup, Form, Modal, Stack } from '@servicetitan/design-system';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { AccountStore } from '../stores/account.store';
import { ChangePasswordStore } from '../stores/change-password.store';
import { observer } from 'mobx-react';
import { Label } from '@servicetitan/form';
import { LoadStatus } from '../../common/enums/load-status';
import { ModalSizes } from '@servicetitan/design-system/dist/components/Modal/components';

export const ChangePasswordModal = provide({
    singletons: [ChangePasswordStore],
})(
    observer(() => {
        const [{ form, changePasswordStatus }, { setModalOpen }] = useDependencies(
            ChangePasswordStore,
            AccountStore
        );
        const {
            $: { oldPassword, newPasswordForm },
        } = form;

        const {
            $: { newPassword, passwordConfirmation },
        } = newPasswordForm;

        const handleClose = () => {
            setModalOpen(false);
        };

        const backendError = changePasswordStatus === LoadStatus.Error;

        return (
            <Modal
                open
                title="Փոխել գաղտնաբառը"
                onClose={handleClose}
                footer={<Footer />}
                size={ModalSizes.S}
            >
                <Stack direction="column" spacing={3}>
                    <Form>
                        <Form.Input
                            label={
                                <Label
                                    label="Հին գաղտնաբառը"
                                    hasError={oldPassword.hasError ?? backendError}
                                />
                            }
                            value={oldPassword.value}
                            onChange={oldPassword.onChangeHandler}
                            error={oldPassword.error ?? backendError ? 'Սխալ գաղտնաբառ' : false}
                            type="password"
                        />

                        <Form.Input
                            label={
                                <Label
                                    label="Նոր գաղտնաբառը"
                                    hasError={newPassword.hasError || newPasswordForm.hasFormError}
                                />
                            }
                            value={newPassword.value}
                            onChange={newPassword.onChangeHandler}
                            error={
                                newPasswordForm.formError
                                    ? newPasswordForm.formError
                                    : newPassword.error
                            }
                            type="password"
                        />

                        <Form.Input
                            label={
                                <Label
                                    label="Կրկնել նոր գաղտնաբառը"
                                    hasError={
                                        !!(passwordConfirmation.hasError ?? newPasswordForm.error)
                                    }
                                />
                            }
                            value={passwordConfirmation.value}
                            onChange={passwordConfirmation.onChangeHandler}
                            error={
                                newPasswordForm.formError
                                    ? newPasswordForm.formError
                                    : passwordConfirmation.error
                            }
                            type="password"
                        />
                    </Form>
                </Stack>
            </Modal>
        );
    })
);

const Footer = observer(() => {
    const [{ isDirty, changePasswordStatus, handleChangePassword }, { setModalOpen }] =
        useDependencies(ChangePasswordStore, AccountStore);
    const handleClose = () => {
        setModalOpen(false);
    };

    const loading = changePasswordStatus === LoadStatus.Loading;
    return (
        <ButtonGroup>
            <Button loading={loading} onClick={handleClose}>
                Չեղարկել
            </Button>
            <Button loading={loading} onClick={handleChangePassword} primary disabled={!isDirty}>
                Պահպանել
            </Button>
        </ButtonGroup>
    );
});
