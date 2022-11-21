import { Button, Divider, Form, Stack } from '@servicetitan/design-system';
import { FilePicker } from '../../../common/components/file-picker/file-picker';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { BooksStore } from '../../stores/books.store';

export const BookSummary = observer(() => {
    const [{ bookForm }] = useDependencies(BooksStore);

    return (
        <Stack className="p-y-3" direction="column">
            <Form.Group className="align-items-stretch">
                <FilePicker
                    className="p-l-2"
                    downloadable
                    imageUrlParam={bookForm.$.pictureUrl.value}
                    buttonProps={{
                        buttonLabel: 'Կցել գրքի լուսանկարը',
                        typesNote: 'Թույլատրված ֆայլերի տեսակները: jpeg, png, jpg, svg',
                    }}
                />
                <Form.Togglebox
                    control="radio"
                    value={1}
                    /*
                     * checked={value === 1}
                     * onClick={value => setValue(value)}
                     */
                    title="Հասանելի"
                    label=""
                />
                <Form.Togglebox
                    control="radio"
                    value={1}
                    /*
                     * checked={value === 1}
                     * onClick={value => setValue(value)}
                     */
                    title="Վարձակալված"
                    label=""
                />
            </Form.Group>
            <Divider className="m-y-3" />
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
            <Divider className="m-y-3" />
            <Stack>
                <Button negative outline iconName="delete">
                    Ջնջել գիրքը
                </Button>
            </Stack>
        </Stack>
    );
});
