import { useHistory } from 'react-router-dom';
import { BodyText } from '@servicetitan/design-system';

export const BackTo = () => {
    const history = useHistory();

    return (
        <div>
            <BodyText onClick={history.goBack} className="cursor-pointer">
                ← Վերադառնալ նախորդ էջ
            </BodyText>
        </div>
    );
};
