import { Folder, NamingConvention, RootFolder } from '@servicetitan/folder-lint';

const jest: Folder[] = [
    {
        name: '__mocks__',
        children: { name: '*' },
        allowedExtensions: '.*',
    },
    {
        name: '__tests__',
        children: { name: '*' },
        /*
         * we can consider function support here that
         * e.g. merges previous allowed extensions and current ones
         * to make sure that store tests are still named xyz.store.test.ts
         */
        allowedExtensions: ['.test.@(ts|tsx)', '.store.test.ts'],
    },
];

const byFileType: Folder[] = [
    {
        name: 'stores',
        allowedExtensions: '.store.ts',
        children: [...jest, { name: '*', children: jest }],
    },
    {
        name: 'utils',
        allowedExtensions: '.ts',
        children: [...jest, { name: '*', children: jest }],
    },
    {
        name: 'components',
        allowedExtensions: ['.tsx', '.module.css', '.module.css.d.ts'],
        children: [...jest, { name: '*', children: jest }],
    },
    {
        name: 'api',
        allowedExtensions: '.api.ts',
        children: jest,
    },
    {
        name: 'styles',
        allowedExtensions: ['.css'],
    },
    {
        name: 'enums',
        allowedExtensions: ['.ts'],
    },
];

const application: Folder = {
    name: 'application',
    children: {
        name: 'src',
        allowedFiles: ['app.module.css', 'app.tsx', 'index.css', 'index.tsx'],
        allowedExtensions: '.*',
        children: {
            name: 'modules',
            allowedFiles: [],
            children: [
                {
                    name: '*', // module level
                    allowedFiles: ['shared-react-components.ts', 'custom-notifications.ts'],
                    children: [
                        ...byFileType,
                        {
                            name: '*', // section level
                            allowedFiles: [],
                            children: [
                                ...byFileType,
                                {
                                    name: '*', // page level
                                    allowedFiles: [],
                                    children: byFileType,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
};

const eslintConfigFolderSchema: Folder = {
    name: 'eslint-config-folder-schema',
    children: {
        name: 'src',
        allowedExtensions: ['.ts'],
    },
};

const config: RootFolder = {
    name: '<root>',
    namingConvention: NamingConvention.DashDelimitedLowercase,
    children: {
        name: 'packages',
        children: [application, eslintConfigFolderSchema],
    },
};

// eslint-disable-next-line import/no-default-export
export default config;
