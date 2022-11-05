import { useHistory } from 'react-router-dom';
import { BodyText } from '@servicetitan/design-system';
import * as Styles from 'back-to.module.less';

export const BackTo = () => {
    const history = useHistory();

    return (
        <div>
            <BodyText onClick={history.goBack} className={Styles.backTo}>
                ← Վերադառնալ նախորդ էջ
            </BodyText>
        </div>
    );
};
