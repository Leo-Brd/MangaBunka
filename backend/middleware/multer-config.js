const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Middleware principal
module.exports = async (req, res, next) => {
    try {
        const upload = multer({ storage: multer.memoryStorage() }).single('profilePic');
        
        upload(req, res, async (err) => {
            if (err) return next(err);
            if (!req.file) {
                console.log('Aucun fichier reçu');
                return next();
            }

            req.file.filename = await traiterImage(req.file);
            console.log(req.file.filename);
            next();
        });
    } catch (error) {
        console.error('Erreur capturée:', error);
        next(error);
    }
};

const traiterImage = async (file) => {
    const testDir = path.resolve(__dirname, '../images');
    console.log('--- TRAITEMENT RÉEL ---');
    
    // 1. VÉRIFICATION DOSSIER
    try {
        await fs.access(testDir);
        console.log('[OK] Dossier existe:', testDir);
    } catch {
        console.log('[WARN] Dossier inexistant, création...');
        await fs.mkdir(testDir, { recursive: true });
    }

    // 2. TRAITEMENT SHARP
    const testImage = path.join(testDir, `img_${Date.now()}.webp`);
    await sharp(file.buffer)
        .webp()
        .toFile(testImage)
        .then(() => console.log('[OK] Fichier créé:', testImage))
        .catch(err => console.error('[ERREUR] Sharp:', err));

    // Vérification finale
    const exists = await fs.access(testImage).then(() => true).catch(() => false);
    console.log('Vérification fichier:', exists ? 'EXISTE' : 'MANQUANT');

    console.log(testImage);

    imgName = testImage.split("\\images\\")[1];

    return imgName;
};