import { observer } from 'mobx-react';
import { Button, ButtonGroup, Divider, Form, Icon, Page, Stack } from '@servicetitan/design-system';
import { FilePicker } from '../../common/components/file-picker/file-picker';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { FilePickerStore } from '../../common/stores/file-picker.store';
import { Label } from '@servicetitan/form';
import { AccountStore } from '../stores/account.store';
import * as Styles from './account.module.less';
import { Fragment } from 'react';
import { ChangePasswordModal } from './change-password-modal';
import { LoadStatus } from '../../common/enums/load-status';
import { SomethingWentWrong } from '../../common/components/something-went-wrong/something-went-wrong';
import { CenteredSpinner } from '../../common/components/centered-spinner/centered-spinner';

export const Account = provide({
    singletons: [FilePickerStore, AccountStore],
})(
    observer(() => {
        const [{ form, setModalOpen, modalOpen, accountUpdateStatus }] =
            useDependencies(AccountStore);
        const {
            $: { name, email, phoneNumber, profilePictureUrl },
        } = form;

        const handleModalOpen = () => {
            setModalOpen(true);
        };

        if (accountUpdateStatus === LoadStatus.Error) {
            return <SomethingWentWrong />;
        }

        if (accountUpdateStatus === LoadStatus.Loading) {
            return <CenteredSpinner />;
        }

        return (
            <Fragment>
                <Page footer={<Footer />}>
                    <Stack direction="column" className={Styles.main}>
                        <FilePicker
                            buttonProps={{
                                buttonLabel: 'Կցել լուսանկար',
                                typesNote: '',
                            }}
                            downloadable
                            imageUrlParam={profilePictureUrl.value}
                        />
                        <Divider spacing="5" />
                        <Form className={Styles.form}>
                            <Form.Input
                                label={<Label label="Անուն Ազգանուն" hasError={name.hasError} />}
                                value={name.value}
                                onChange={name.onChangeHandler}
                                error={name.error}
                            />

                            <Form.Input
                                label={
                                    <Label label="Էլեկտրոնային հասցե" hasError={email.hasError} />
                                }
                                value={email.value}
                                onChange={email.onChangeHandler}
                                error={email.error}
                                disabled
                            />

                            <Form.Input
                                label={
                                    <Label label="Հեռախոսահամար" hasError={phoneNumber.hasError} />
                                }
                                value={phoneNumber.value}
                                onChange={phoneNumber.onChangeHandler}
                                error={phoneNumber.error}
                            />
                        </Form>
                        <Button className="m-t-4" outline width="250px" onClick={handleModalOpen}>
                            <Icon name="vpn_key" className="m-r-1" />
                            Փոխել գաղտնաբառը
                        </Button>
                    </Stack>
                </Page>
                {modalOpen && <ChangePasswordModal />}
            </Fragment>
        );
    })
);

const Footer = observer(() => {
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
});
