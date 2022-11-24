const { createWebpackConfig } = require('@servicetitan/startup');

module.exports = createWebpackConfig({
    configuration: {
        mode: 'development',
        output: {
            publicPath: '/',
        },
    },
    plugins: {
        HtmlWebpackPlugin: {
            title: 'Բի-Բի Բուքս',
            favicon: './src/modules/common/assets/favicon.ico',
        },
    },
});
