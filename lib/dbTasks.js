/**
 * Db Helper methods for Sequelize ACL
 */
'use strict';

let buckets   = ['meta', 'parents', 'permissions', 'resources', 'roles', 'users'];

module.exports = {
	/**
	 * Setup new Sequlize connection
	 *
	 * @param  {Sequlize} db  Sequlize connection
	 * @param  {Object} options
	 * @param  {String} options.prefix table prefix
	 * @param  {Object<str, Object>} options.schema Sequlize Schema settings per bucket 'meta'|'parents'|'permissions'|'resources'|'roles'|'users'
	 * @param  {Object} options.defaultSchema Sequlize Schema settings for all buckets with no specific schema
	 * @return {Sequlize} Sequlize connection
	 */
	setup: function dbTaskSetup (db, options) {
		let prefix        = options.prefix,
			schema        = options.schema || {},
			defaultSchema = options.defaultSchema || {
				key: {type: db.Sequelize.STRING, primaryKey: true},
				value: {type: db.Sequelize.TEXT}
			};

		buckets.forEach(table => {
			let name = prefix + table;
			if (!db.models[name]) {
				db.models[name] = db.sequelize.define(name, schema[table] || defaultSchema, {
					charset: 'utf8',
					collate: 'utf8_general_ci',
				});
				db.models[name].sync();
			}
		});
		return db;
	}
};