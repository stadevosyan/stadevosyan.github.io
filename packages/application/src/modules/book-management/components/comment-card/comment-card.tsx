import { Avatar, Stack } from '@servicetitan/design-system';

export const CommentCard = () => {
    return (
        <Stack.Item className="m-y-2">
            <Stack direction="column">
                <Stack alignItems="center" className="m-b-2">
                    <Stack.Item className="m-r-6">
                        <Avatar name="RT" />
                        Անուն ազգանուն
                    </Stack.Item>
                    <Stack.Item>12.11.22</Stack.Item>
                </Stack>
                <Stack>
                    Նոր դիստոպիան ապագայի մասին է, որտեղ երեխաներին սովորեցնում են արհեստական ընկեր
                    կոչվող ռոբոտները: Վեպի գլխավոր հերոսուհին՝ Կլարան, հենց այդպիսի ռոբոտ է, և
                    չնայած նրա գիտելիքները հսկայական են, նա շատ քիչ բան գիտի իրեն շրջապատող աշխարհի
                    մասին, և նրա կյանքը ամբողջովին կախված է նրանից, թե ով է նրան գնում:
                </Stack>
            </Stack>
        </Stack.Item>
    );
};
