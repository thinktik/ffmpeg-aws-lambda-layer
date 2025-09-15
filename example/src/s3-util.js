const {S3Client, GetObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');
const {pipeline} = require('stream/promises');

const s3 = new S3Client({});

const downloadFileFromS3 = async (bucket, fileKey, filePath) => {
    console.log('downloading', bucket, fileKey, filePath);
    const response = await s3.send(new GetObjectCommand({
        Bucket: bucket, Key: fileKey
    }));
    await pipeline(response.Body, fs.createWriteStream(filePath));
    console.log('downloaded', bucket, fileKey);
    return filePath;
};

const uploadFileToS3 = async (bucket, fileKey, filePath, contentType) => {
    console.log('uploading', bucket, fileKey, filePath);
    await s3.send(new PutObjectCommand({
        Bucket: bucket, Key: fileKey, Body: fs.createReadStream(filePath), ContentType: contentType
    }));
};

module.exports = {
    downloadFileFromS3, uploadFileToS3
};