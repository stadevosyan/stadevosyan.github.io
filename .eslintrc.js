const path = require('path');
const glob = require('glob');

const { restrictImports } = require('@servicetitan/restrict-imports');

module.exports = {
    extends: ['@servicetitan/eslint-config/mono', 'folder-schema'],
    rules: {
        'import/no-restricted-paths': [
            'error',
            {
                zones: [
                    /** More details: https://servicetitan.quip.com/WjI2AhXrtgaX/Import-restrictions */
                    ...packagesRestrictions(), // restrict imports between packages
                    ...applicationModulesRestrictions(),
                ],
            },
        ],
    },
};

function packagesRestrictions() {
    const base = path.resolve('./packages') + '/';
    return restrictImports(base, getSubDirs(base));
}

function applicationModulesRestrictions() {
    return modulesRestrictions('application', [{ name: '*', allow: 'common' }]);
}

function modulesRestrictions(packageName, config) {
    const base = `./packages/${packageName}/src/modules/`;
    const modules = getSubDirs(base);

    const zones = restrictImports(base, modules, config);

    // internal restrictions for every module
    const subZones = modules
        .map(name => subModulesRestrictions(`${base}${name}/`, 2))
        .reduce(concatReducer, []);

    return [...zones, ...subZones];
}

function subModulesRestrictions(base, depth) {
    const byFileType = ['stores', 'api', 'utils', 'styles', 'components', 'enums', 'assets'];
    const isNotByFileType = name => !byFileType.includes(name);

    // sections (pages)
    const subModules = getSubDirs(base).filter(isNotByFileType);
    // restrict imports from siblings, except for `byFileType` folders
    const zones = restrictImports(base, subModules, { name: '*', allow: byFileType });

    return [...zones, ...subZones()];

    function subZones() {
        if (depth <= 0) {
            return [];
        }

        return subModules
            .map(sm => subModulesRestrictions(`${base}${sm}/`, depth - 1))
            .reduce(concatReducer, []);
    }
}

function getSubDirs(base) {
    return glob.sync(base + '*/').map(p => path.basename(p));
}

function concatReducer(acc, xs) {
    return [...acc, ...xs];
}
