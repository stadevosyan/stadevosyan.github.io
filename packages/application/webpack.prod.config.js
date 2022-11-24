const { createWebpackConfig } = require('@servicetitan/startup');

module.exports = createWebpackConfig({
    configuration: {
        mode: 'production',
    },
    plugins: {
        HtmlWebpackPlugin: {
            title: 'Էլ Գրադարան',
            favicon: './src/modules/common/assets/favicon.ico',
        },
    },
});
