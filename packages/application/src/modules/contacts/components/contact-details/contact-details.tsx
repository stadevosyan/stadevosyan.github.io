import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { observer } from 'mobx-react';
import { Divider, Headline, Page, Stack } from '@servicetitan/design-system';
import { LoadStatus } from '../../../common/enums/load-status';
import { CenteredSpinner } from '../../../common/components/centered-spinner/centered-spinner';
import { ContactDetailsStore } from '../../stores/contact-details.store';
import { BackTo } from '../../../common/components/back-to/back-to';
import { baseUrl } from '../../../../app';
import { LabelValueInfo } from '../../../common/components/label-value-info/label-value-info';
import { phoneNumberToThreeDigitFormat } from '../../../common/utils/phone-number-utils';
import { UserBookCard } from './book-card';

export const ContactDetails = provide({ singletons: [ContactDetailsStore] })(
    observer(() => {
        const [{ init, userData, fetchContactDataStatus }] = useDependencies(ContactDetailsStore);
        const params = useParams<{ id: string }>();

        useEffect(() => {
            init(+params.id);
        }, [init, params.id]);

        if (fetchContactDataStatus === LoadStatus.Loading || !userData) {
            return <CenteredSpinner />;
        }

        return (
            <Page className="p-3">
                <Stack direction="column" spacing={3}>
                    <BackTo />
                    <Stack spacing={3}>
                        {userData.imageUrl && <img src={`${baseUrl}${userData?.imageUrl}`} />}
                        <Stack direction="column" spacing={3}>
                            <LabelValueInfo label="Անուն Ազգանուն" value={userData?.name} />
                            <Stack wrap="wrap" spacing={3} alignItems="center" direction="row">
                                <LabelValueInfo
                                    label="հեռախոսահամար"
                                    value={phoneNumberToThreeDigitFormat(userData?.phoneNumber)}
                                />
                                <LabelValueInfo
                                    label="Էլեկտրոնային հասցե"
                                    value={userData?.email}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Headline>Ներկա պահին վարձակալած գրքեր</Headline>
                    <Stack spacing={2} wrap="wrap" style={{ maxWidth: '800px' }}>
                        {userData.books.map(item => (
                            <UserBookCard key={item.id} bookData={item} />
                        ))}
                    </Stack>
                </Stack>
            </Page>
        );
    })
);
