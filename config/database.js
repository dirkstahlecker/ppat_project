var connection_string = 'mongodb://localhost:27017/ppatTestDB';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + 'ppatTestDB';
}

// config/database.js
module.exports = {

	'url' : connection_string // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};
