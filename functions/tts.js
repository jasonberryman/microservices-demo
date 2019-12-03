const functions = require('firebase-functions');

// Take the translated text and convert it to speech
exports.createTTSFromFirestore = functions
  .firestore
  .document('next/{docId}')
  .onUpdate(async (change, context) => {
  
  const {audioContent = false, translatedText = false, language = 'fr-FR'} = change.after.data();

  if (!translatedText || audioContent) {return null;}

  // Lazy load the client libraries
  const textToSpeech = require('@google-cloud/text-to-speech');
  const client = new textToSpeech.TextToSpeechClient();
  
  let request = {
    input: {text: translatedText},
    voice: {languageCode: language, name: `${language}-Wavenet-A`},
    audioConfig: {
      audioEncoding: 'MP3',
      effectsProfileId: ['large-home-entertainment-class-device']
    }
  };

  // Performs the Text-to-Speech request
  let [response] = await client.synthesizeSpeech(request);

  return change.after.ref.update({audioContent: response.audioContent});

});
