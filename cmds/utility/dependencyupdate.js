const request = require('node-superfetch');
const semver = require('semver');
const { stripIndents } = require('common-tags');
const { dependencies } = require('@root/package');

module.exports = class DependencyUpdateCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'dependency-update',
            aliases: ['dep-update', 'dependencies-update', 'npm-update', 'du'],
            group: 'util',
            memberName: 'dependency-update',
            description: 'Checks for dependency updates.',
            details: 'Only the bot owner(s) may use this command.',
            ownerOnly: true,
            guarded: true,
            credit: [
                {
                    name: 'npm',
                    url: 'https://www.npmjs.com/',
                    reason: 'API'
                }
            ]
        });
    }

    async run(message) {
        logger.info(`Command: ${this.name}, User: ${message.author.tag}`)
        const needUpdate = [];
        for (const [dep, ver] of Object.entries(dependencies)) {
            const update = await this.parseUpdate(dep, ver);
            if (!update) continue;
            needUpdate.push(update);
        }
        if (!needUpdate.length) return message.say('All packages are up to date.');
        const updatesList = needUpdate.map(pkg => {
            const breaking = pkg.breaking ? ' ⚠️' : '';
            return `${pkg.name} (${pkg.oldVer} -> ${pkg.newVer})${breaking}`;
        });
        return message.say(stripIndents`
			__**Package Updates Available:**__
            ${updatesList.join('\n')} 
            Btw use: ncu -u, npm install
		`);
    }

    async fetchVersion(dependency) {
        const { body } = await request.get(`https://registry.npmjs.com/${dependency}`);
        if (body.time.unpublished) return null;
        return body['dist-tags'].latest;
    }

    async parseUpdate(dep, ver) {
        if (ver.startsWith('github:')) return null;
        const latest = await this.fetchVersion(dep);
        const clean = ver.replace(/^(\^|<=?|>=?|=|~)/, '');
        if (latest === clean) return null;
        return {
            name: dep,
            oldVer: clean,
            newVer: latest,
            breaking: !semver.satisfies(latest, ver)
        };
    }
};