import { FC } from 'react';
import { observer } from 'mobx-react';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { CreateNewReviewStore } from '../../stores/create-new-review.store';
import { UserBookDetailsStore } from '../../stores/user-book-details.store';
import { Button, ButtonGroup, Form, Modal } from '@servicetitan/design-system';
import { LoadStatus } from '../../../common/enums/load-status';

export const WriteReviewModal: FC<{ bookId: number }> = provide({
    singletons: [CreateNewReviewStore],
})(
    observer(({ bookId }) => {
        const [{ closeModal }, { commentForm, saveReview, saveBookReviewLoadStatus }] =
            useDependencies(UserBookDetailsStore, CreateNewReviewStore);

        const handleReviewSave = () => {
            saveReview(bookId);
        };

        const saving = saveBookReviewLoadStatus === LoadStatus.Loading;

        return (
            <Modal
                open
                focusTrapOptions={{ disabled: true }}
                onClose={closeModal}
                title="Գրել մեկնաբանություն"
                footer={
                    <ButtonGroup>
                        <Button onClick={closeModal} disabled={saving}>
                            Չեղարկել
                        </Button>
                        <Button loading={saving} onClick={handleReviewSave} primary>
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
                    disabled={saving}
                />
            </Modal>
        );
    })
);
