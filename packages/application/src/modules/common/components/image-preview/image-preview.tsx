import { Card } from '@servicetitan/design-system';
import { FC } from 'react';
import { ImagePlaceholder } from '../image-placeholder/image-placeholder';
import { urlToShow } from '../../utils/url-helpers';

import * as Styles from './image-preview.module.less';

interface ImagePreviewProps {
    url?: string;
}

export const ImagePreview: FC<ImagePreviewProps> = ({ url }) => {
    return (
        <Card className={Styles.root} padding="thin">
            {url ? (
                <img
                    src={urlToShow(url)}
                    style={{
                        height: 'auto',
                        display: 'block',
                        maxWidth: '100%',
                    }}
                    alt=""
                />
            ) : (
                <ImagePlaceholder width={195} height={260} />
            )}
        </Card>
    );
};
