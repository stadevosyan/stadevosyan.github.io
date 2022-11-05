import { Linter } from 'eslint';

module.exports = {
    plugins: ['@servicetitan/folder-schema'],
    rules: {
        '@servicetitan/folder-schema/check': [
            'error',
            {
                root: process.cwd(),
                config: require.resolve('./config'),
                docLink:
                    'https://servicetitan.quip.com/6aL7AkSOxaYa/File-naming-convention-folder-structure',
            },
        ],
    },
} as Linter.Config;
