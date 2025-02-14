const {S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const s3 = new S3Client({region: process.env.AWS_REGION || 'eu-west-3'});
const BUCKET_NAME = process.env.BUCKET_NAME || 'votre-nom-de-bucket';
const FOLDER = 'images';

/**
 * Liste les objets (images) dans le dossier fixe.
 */
async function listImages() {
    const prefix = `${FOLDER}/`;
    const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix
    });
    const response = await s3.send(command);
    // Filtre pour ne garder que les objets qui ne se terminent pas par '/'
    return (response.Contents || [])
        .filter(item => item.Key && !item.Key.endsWith('/'))
        .map(item => ({
            ...item, // Conserve les champs d'origine : Key, LastModified, Size, etc.
            url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}` // Ajoute l'URL publique
        }));
}

/**
 * Ajoute une image dans le dossier fixe.
 * @param {string} fileName Nom du fichier à ajouter.
 * @param {string} fileContent Contenu de l'image en base64.
 */
async function addImage(fileName, fileContent) {
    const key = `${FOLDER}/${fileName}`;
    const buffer = Buffer.from(fileContent, 'base64');
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'file.type'
    });
    await s3.send(command);
}

/**
 * Supprime une image dans le dossier fixe.
 * @param {string} fileName Nom du fichier à supprimer.
 */
async function deleteImage(fileName) {
    const key = `${FOLDER}/${fileName}`;
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });
    await s3.send(command);
}

module.exports = {listImages, addImage, deleteImage};
