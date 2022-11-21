import { BodyText, Divider, Form, Stack } from '@servicetitan/design-system';
import { FilePicker } from '../../../common/components/file-picker/file-picker';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { BooksStore } from '../../stores/books.store';
import { baseUrl } from '../../../../app';
import { ReactElement } from 'react';

export const BookSummary = observer(() => {
    const [{ bookForm, categories }] = useDependencies(BooksStore);

    const generateCheckboxes = () => {
        const checkboxes: ReactElement[] = [];

        bookForm.$.categoryIds.$.forEach((category, id) => {
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
                        imageUrlParam={`${baseUrl}${bookForm.$.pictureUrl.value}`}
                        buttonProps={{
                            buttonLabel: 'Կցել գրքի լուսանկարը',
                            typesNote: 'Թույլատրված ֆայլերի տեսակները: jpeg, png, jpg, svg',
                        }}
                    />
                </Stack.Item>
            </Stack>
            <Stack direction="column">
                <BodyText el="div" size="small" bold className="m-b-1 d-b">
                    Ժանրեր
                </BodyText>
                <Form.Group>{generateCheckboxes()}</Form.Group>
            </Stack>
            <Divider className="m-y-3" />
            <BodyText className="m-b-2 t-truncate" size="small" bold>
                Հասանելիություն
            </BodyText>
            <Form.Group className="align-items-stretch">
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
        </div>
    );
});
