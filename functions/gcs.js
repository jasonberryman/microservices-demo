const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.writeBase64Audio = functions
.firestore
.document('next/{docId}')
.onUpdate(async (change, context) => {
  
  const {audioContent = false} = change.after.data();
  if (!audioContent) {return null;}

  const bucketRef = admin.storage().bucket();

  // console.error('This will fail!');
  const filename = change.after.id + '_translated.mp3';

  const fileRef = bucketRef.file(filename);

  let buff = Buffer.from(audioContent, 'binary');
  
  const stream = fileRef.createWriteStream({metadata: {contentType: 'audio/mpeg'}});
  stream.on('error', (err) => {
    return(err);
  });
  stream.on('finish', () => {
    console.log('File written');
    return(true);
  });
  stream.end(new Buffer(buff, 'base64'));
  return Promise.resolve(true);
});
