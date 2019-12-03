const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.translate = require('./translate');
exports.tts = require('./tts');
exports.gcs = require('./gcs');
