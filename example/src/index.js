const s3Util = require('./s3-util');
const childProcessPromise = require('./child-process-promise');
const path = require('path');
const os = require('os');

const {
    EXTENSION,
    THUMB_WIDTH,
    OUTPUT_BUCKET,
    MIME_TYPE
} = process.env;

exports.handler = async (event, context) => {
    const eventRecord = event.Records?.[0];
    if (!eventRecord) {
        throw new Error('No S3 event record found');
    }

    const inputBucket = eventRecord.s3.bucket.name;
    const key = decodeURIComponent(eventRecord.s3.object.key.replace(/\+/g, ' '));
    const id = context.awsRequestId;
    const resultKey = key.replace(/\.[^.]+$/, EXTENSION);
    const workdir = os.tmpdir();
    const inputFile = path.join(workdir, id + path.extname(key));
    const outputFile = path.join(workdir, id + EXTENSION);

    console.log('converting', inputBucket, key, 'using', inputFile);

    await s3Util.downloadFileFromS3(inputBucket, key, inputFile);

    await childProcessPromise.spawn('/opt/bin/ffmpeg', [
        '-loglevel', 'error',
        '-y',
        '-i', inputFile,
        '-vf', `thumbnail,scale=${THUMB_WIDTH}:-1`,
        '-frames:v', '1',
        outputFile
    ], {env: process.env, cwd: workdir});

    await s3Util.uploadFileToS3(OUTPUT_BUCKET, resultKey, outputFile, MIME_TYPE);
};