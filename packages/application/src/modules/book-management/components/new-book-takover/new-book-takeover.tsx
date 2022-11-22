import {
    BodyText,
    Button,
    ButtonGroup,
    Divider,
    Form,
    Layout,
    Stack,
    Takeover,
} from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';

import { FilePicker } from '../../../common/components/file-picker/file-picker';
import { NewBookStore } from '../../stores/new-book.store';
import { ReactElement, useEffect } from 'react';
import { LoadStatus } from '../../../common/enums/load-status';

import * as Styles from '../../../contacts/components/add-contact-takeover/add-contact-takeover.module.less';

export const NewBookTakeover = observer(() => {
    const [newBookStore] = useDependencies(NewBookStore);
    const {
        loading,
        newBookForm: { $ },
        categories,
    } = newBookStore;

    useEffect(() => {
        const elements = document.getElementsByClassName('BackLink__label');
        if (elements.length) {
            elements[0].textContent = 'Վերադառնալ գլխավոր էջ';
        }
    }, []);

    const generateCheckboxes = () => {
        const checkboxes: ReactElement[] = [];

        $.categoryIds.$.forEach((category, id) => {
            checkboxes.push(
                <Form.Togglebox
                    className="m-b-2-i"
                    checked={category.value}
                    value={!category.value}
                    onClick={category.onChange}
                    label={categories.get(id)}
                />
            );
        });

        return checkboxes;
    };

    return (
        <Takeover
            open
            focusTrapOptions={{ disabled: true }}
            title="Ավելացնել նոր գիրք"
            backLabel="Վերադառնալ գլխավոր էջ"
            className={Styles.takeover}
            footer={
                <ButtonGroup>
                    <Button onClick={newBookStore.handleClose}>Չեղարկել</Button>
                    <Button
                        loading={loading === LoadStatus.Loading}
                        onClick={newBookStore.createBook}
                        primary
                    >
                        Ավելացնել
                    </Button>
                </ButtonGroup>
            }
            onBack={newBookStore.handleClose}
            onClose={newBookStore.handleClose}
        >
            <Layout type="island">
                <Stack direction="column">
                    <Stack.Item>
                        <FilePicker
                            downloadable
                            buttonProps={{ buttonLabel: 'Կցել Լուսանկար', typesNote: '' }}
                        />
                    </Stack.Item>
                    <Divider className="m-y-3" />
                    <Form>
                        <Form.Group widths="equal" className="">
                            <Form.Input
                                label="Գրքի անուն"
                                value={$.title.value}
                                onChange={$.title.onChangeHandler}
                                error={$.title.error}
                            />
                            <Form.Input
                                label="Հեղինակի անուն"
                                value={$.author.value}
                                onChange={$.author.onChangeHandler}
                                error={$.author.error}
                            />
                        </Form.Group>
                        <Form.TextArea
                            label="Նկարագրություն (ոչ պարտադիր)"
                            value={$.description.value}
                            onChange={$.description.onChangeHandler}
                            error={$.description.error}
                        />
                        <BodyText el="div" size="small" bold className="m-b-1 d-b">
                            Ժանրեր
                        </BodyText>
                        <Form.Group>{generateCheckboxes()}</Form.Group>
                    </Form>
                </Stack>
            </Layout>
        </Takeover>
    );
});
