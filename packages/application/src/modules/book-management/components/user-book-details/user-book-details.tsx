import {
    BodyText,
    Button,
    ButtonGroup,
    Divider,
    Eyebrow,
    Form,
    Headline,
    Modal,
    Stack,
    Tag,
} from '@servicetitan/design-system';

import { useHistory, useParams } from 'react-router-dom';
import { ImagePreview } from '../../../common/components/image-preview/image-preview';
import { CommentCard } from '../comment-card/comment-card';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { UserBookDetailsStore } from '../../stores/user-book-details.store';
import { observer } from 'mobx-react';
import { LoadStatus } from '../../../common/enums/load-status';
import { useEffect } from 'react';

export const UserBookDetails = provide({ singletons: [UserBookDetailsStore] })(
    observer(() => {
        const [
            {
                open,
                openModal,
                closeModal,
                saveReview,
                commentForm,
                loading,
                init,
                book,
                categories,
            },
        ] = useDependencies(UserBookDetailsStore);
        const history = useHistory();
        const { id } = useParams<{ id: string }>();

        useEffect(() => {
            if (typeof +id === 'number') {
                init(+id);
            }
        }, [id, init]);

        return (
            <Stack direction="column" className="filters p-b-3">
                <Stack direction="column" className="p-b-3">
                    <Stack direction="column" className="p-3">
                        <Stack direction="column">
                            <BodyText onClick={history.goBack} className="cursor-pointer m-b-3">
                                ← Վերադառնալ նախորդ էջ
                            </BodyText>
                            <Stack>
                                <ImagePreview url={book?.pictureUrl} />
                                <Stack direction="column" className="m-l-2">
                                    <Headline className="m-b-2 t-truncate" size="large">
                                        {book?.title ?? '--'}
                                        <Tag className="m-l-2" color="success" subtle>
                                            Հասանելի է
                                        </Tag>
                                    </Headline>
                                    <Eyebrow className="m-b-2 t-truncate" size="medium">
                                        {book?.author ?? '--'}
                                    </Eyebrow>
                                    <Stack className="m-b-2">
                                        {book?.categories?.map(item => (
                                            <Tag key={item.categoryId} className="m-1">
                                                {categories.get(item.categoryId)}
                                            </Tag>
                                        ))}
                                    </Stack>
                                    <Headline className="m-b-2 t-truncate" size="small">
                                        Նկարագրություն
                                    </Headline>
                                    <BodyText>
                                        Նոր դիստոպիան ապագայի մասին է, որտեղ երեխաներին սովորեցնում
                                        են արհեստական ընկեր կոչվող ռոբոտները: Վեպի գլխավոր
                                        հերոսուհին՝ Կլարան, հենց այդպիսի ռոբոտ է, և չնայած նրա
                                        գիտելիքները հսկայական են, նա շատ քիչ բան գիտի իրեն շրջապատող
                                        աշխարհի մասին, և նրա կյանքը ամբողջովին կախված է նրանից, թե
                                        ով է նրան գնում:
                                    </BodyText>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Divider className="m-t-4" />
                </Stack>
                <Stack className="p-3" justifyContent="space-between">
                    <Stack.Item>
                        <Headline className="m-b-2 t-truncate" size="small">
                            Մեկնաբանություններ
                        </Headline>
                    </Stack.Item>
                    <Stack.Item>
                        <Button iconName="comment" outline onClick={openModal}>
                            Գրել մեկնաբանություն
                        </Button>
                    </Stack.Item>
                </Stack>
                <Stack className="p-3" direction="column">
                    <CommentCard
                        id={0}
                        review="Նոր դիստոպիան ապագայի մասին է, որտեղ երեխաներին սովորեցնում են արհեստական ընկեր կոչվող ռոբոտները: Վեպի գլխավոր հերոսուհին՝ Կլարան, հենց այդպիսի ռոբոտ է, և չնայած նրա գիտելիքները հսկայական են, նա շատ քիչ բան գիտի իրեն շրջապատող աշխարհի մասին, և նրա կյանքը ամբողջովին կախված է նրանից, թե ով է նրան գնում:"
                        name="Անուն ազգանուն"
                    />
                </Stack>
                <Modal
                    open={open}
                    focusTrapOptions={{ disabled: true }}
                    onClose={closeModal}
                    title="Գրել մեկնաբանություն"
                    footer={
                        <ButtonGroup>
                            <Button onClick={closeModal}>Չեղարկել</Button>
                            <Button
                                loading={loading === LoadStatus.Loading}
                                onClick={saveReview}
                                primary
                            >
                                Պահպանել
                            </Button>
                        </ButtonGroup>
                    }
                    portal={false}
                >
                    <Form.TextArea
                        label="Իմ մեկնաբանությունը"
                        value={commentForm.$.review.value}
                        onChange={commentForm.$.review.onChangeHandler}
                        error={commentForm.$.review.error}
                    />
                </Modal>
            </Stack>
        );
    })
);
