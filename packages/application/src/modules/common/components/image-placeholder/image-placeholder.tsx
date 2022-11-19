import classNames from 'classnames';

import { imgPlaceholder } from './image-placeholder.module.less';

const ImgIcon = () => (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M37.75 33.5833V4.41667C37.75 2.11458 35.8854 0.25 33.5833 0.25H4.41667C2.11458 0.25 0.25 2.11458 0.25 4.41667V33.5833C0.25 35.8854 2.11458 37.75 4.41667 37.75H33.5833C35.8854 37.75 37.75 35.8854 37.75 33.5833ZM11.7083 22.125L16.9167 28.3854L24.2083 19L33.5833 31.5H4.41667L11.7083 22.125Z"
            fill="#14A6B6"
        />
    </svg>
);

export const ImagePlaceholder = ({ width = 100, height = 120, classes = '' }) => {
    return (
        <div
            style={{
                height,
                width,
            }}
            className={classNames('w-100 h-100 fs-2', imgPlaceholder, classes)}
        >
            <ImgIcon />
        </div>
    );
};
