import {
    BodyText,
    Button,
    ButtonGroup,
    Divider,
    Drawer,
    Form,
    Stack,
} from '@servicetitan/design-system';
import { FilePicker } from '../../../common/components/file-picker/file-picker';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { useEffect } from 'react';
import { GeneralDataStore } from '../../../common/stores/general-data.store';
import { LoadStatus } from '../../../common/enums/load-status';
import { CenteredSpinner } from '../../../common/components/centered-spinner/centered-spinner';
import { BookDetailsStore } from '../../stores/book-details.store';

export const BookSummary = observer(() => {
    const [
        {
            users,
            bookForm,
            categoriesMap,
            cleanBookEditState,
            openAssignBookModal,
            closeAssignBookModal,
            assignModal,
            usersIds,
            categoriesIds,
            resetAssignForm,
            handleAssignToUser,
            updateUserId,
            holderUserId,
        },
        { fetchCategoriesStatus },
    ] = useDependencies(BookDetailsStore, GeneralDataStore);

    useEffect(() => {
        /*
         * return () => {
         *     cleanBookEditState();
         * };
         */
    }, [cleanBookEditState]);

    if (fetchCategoriesStatus === LoadStatus.Loading) {
        return <CenteredSpinner />;
    }

    return (
        <div className="w-100">
            <Stack className="p-y-3 w-100" justifyContent="space-between">
                <Stack.Item fill>
                    <Form.Group widths="equal" className="">
                        <Form.Input
                            label="Գրքի անուն"
                            value={bookForm.$.title.value}
                            onChange={bookForm.$.title.onChangeHandler}
                            error={bookForm.$.title.error}
                        />
                        <Form.Input
                            label="Հեղինակի անուն"
                            value={bookForm.$.author.value}
                            onChange={bookForm.$.author.onChangeHandler}
                            error={bookForm.$.author.error}
                        />
                    </Form.Group>
                    <Form.TextArea
                        label="Նկարագրություն (ոչ պարտադիր)"
                        value={bookForm.$.description.value}
                        onChange={bookForm.$.description.onChangeHandler}
                        error={bookForm.$.description.error}
                    />
                </Stack.Item>
                <Stack.Item>
                    <FilePicker
                        className="p-l-2"
                        downloadable
                        imageUrlParam={bookForm.$.pictureUrl.value}
                        buttonProps={{
                            buttonLabel: 'Կցել գրքի լուսանկարը',
                            typesNote: '',
                        }}
                    />
                </Stack.Item>
            </Stack>
            <Stack direction="column">
                <BodyText el="div" size="small" bold className="m-b-1 d-b">
                    Ժանրեր
                </BodyText>
                {!!categoriesIds.length && !!bookForm.$.categoryIds.$.size && (
                    <Form.Group>
                        {categoriesIds.map(id => {
                            if (!bookForm.$.categoryIds.$.get(id)) {
                                return <div />;
                            }

                            return (
                                <Form.Togglebox
                                    key={id}
                                    className="m-b-2-i"
                                    checked={bookForm.$.categoryIds.$.get(id)!.value}
                                    value={!bookForm.$.categoryIds.$.get(id)!.value}
                                    onClick={bookForm.$.categoryIds.$.get(id)!.onChange}
                                    label={categoriesMap.get(id)?.name ?? ''}
                                />
                            );
                        })}
                    </Form.Group>
                )}
            </Stack>
            <Divider className="m-y-3" />
            <BodyText className="m-b-2 t-truncate" size="small" bold>
                Հասանելիություն
            </BodyText>
            <Form.Group className="align-items-stretch">
                <Form.Togglebox
                    control="radio"
                    value={!bookForm.$.isAvailable.value}
                    checked={bookForm.$.isAvailable.value === false}
                    onClick={bookForm.$.isAvailable.onChange}
                    title="Հասանելի"
                    label=""
                />
                <Form.Togglebox
                    control="radio"
                    value={!bookForm.$.isAvailable.value}
                    checked={bookForm.$.isAvailable.value === true}
                    onClick={bookForm.$.isAvailable.onChange}
                    title="Վարձակալված"
                    label=""
                />
            </Form.Group>
            {bookForm.$.isAvailable.value && (
                <Button
                    iconName="keyboard_arrow_right"
                    iconPosition="right"
                    outline
                    onClick={openAssignBookModal}
                >
                    նշել վարձակալի անունը
                </Button>
            )}
            <Drawer
                backdrop
                header="Նշել վարձակալին"
                open={assignModal}
                onClose={closeAssignBookModal}
                footer={
                    <ButtonGroup>
                        <Button onClick={resetAssignForm}>Չեղարկել</Button>
                        <Button primary onClick={handleAssignToUser}>
                            Կիրառել
                        </Button>
                    </ButtonGroup>
                }
            >
                {usersIds.map(id => {
                    return (
                        <Form.Togglebox
                            key={id}
                            control="radio"
                            className="m-b-2-i"
                            checked={id === holderUserId}
                            value={id}
                            onClick={() => {
                                updateUserId(id);
                            }}
                            label={users.get(id)!.name}
                        />
                    );
                })}
            </Drawer>
        </div>
    );
});
