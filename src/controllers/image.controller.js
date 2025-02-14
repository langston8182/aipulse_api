const { listImages, addImage, deleteImage } = require('../services/image.service');

async function imagesController(httpMethod, path, body) {
    if (httpMethod === 'GET') {
        // Lister les images dans le dossier fixe
        const images = await listImages();
        return {
            statusCode: 200,
            body: JSON.stringify(images)
        };
    }

    if (httpMethod === 'POST') {
        // Ajouter une image
        // Attendu dans le body : { "fileName": "monImage.jpg", "fileContent": "<base64>" }
        const data = body;
        const { fileName, fileContent } = data;
        await addImage(fileName, fileContent);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image ajoutée' })
        };
    }

    if (httpMethod === 'DELETE') {
        // Supprimer une image
        // Le nom du fichier est passé dans l'URL : /admin/images/monImage.jpg
        const parts = path.split('/');
        const fileName = parts.pop() || parts.pop(); // gestion du slash terminal éventuel
        await deleteImage(fileName);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image supprimée' })
        };
    }
}

module.exports = {
    imagesController
}
