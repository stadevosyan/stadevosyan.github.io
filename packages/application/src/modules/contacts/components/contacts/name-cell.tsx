import { FC } from 'react';
import { TableCellProps } from '@servicetitan/table';
import { Avatar, BodyText, Stack } from '@servicetitan/design-system';
import { getAvatarFirstLetters, urlToShow } from '../../../common/utils/url-helpers';

export const NameCell: FC<TableCellProps> = (props: TableCellProps) => {
    const { colSpan, dataItem, className, style } = props;

    return (
        <td colSpan={colSpan} className={className} style={style}>
            <Stack alignItems="center" className="m-y-1">
                <Avatar
                    size="s"
                    name={getAvatarFirstLetters(dataItem.name)}
                    autoColor
                    image={urlToShow(dataItem?.profilePictureUrl)}
                />
                <BodyText className="p-l-1 t-truncate" size="medium">
                    {dataItem.name}
                </BodyText>
            </Stack>
        </td>
    );
};
