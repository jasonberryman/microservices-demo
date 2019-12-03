const functions = require('firebase-functions');

exports.translateText = functions
  // .region('europe-west2')
  .firestore.document('next/{docId}')
  .onCreate(async (snap, context) => {
  
  let {text = '', language = 'fr-FR'} = snap.data();

  // Strip out TTS part of language
  language = language.substr(0,2);
  console.log(`Converting ${text} to ${language}`)
  
  // Imports the Google Cloud client library
  const {Translate} = require('@google-cloud/translate').v2;

  // Instantiates a client
  const translate = new Translate();

  // Translates some text into another language
  const [translation] = await translate.translate(text, language);
  console.log(`Translated ${text} to ${translation}`);
  return snap.ref.update({translatedText: translation});
});