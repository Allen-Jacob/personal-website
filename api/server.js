/**
 * API pour les statistiques Linktree
 * Stockage dans MongoDB
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Configuration CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:8080'];

app.use(cors({
    origin: function(origin, callback) {
        // Autoriser les requêtes sans origine (comme les apps mobiles)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

// Schéma pour les clics
const ClickSchema = new mongoose.Schema({
    linkName: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    userAgent: String,
    ipAddress: String
});

const Click = mongoose.model('Click', ClickSchema);

// ============================================
// ROUTES API
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Enregistrer un clic
app.post('/api/clicks', async (req, res) => {
    try {
        const { linkName } = req.body;

        if (!linkName) {
            return res.status(400).json({ error: 'linkName is required' });
        }

        const click = new Click({
            linkName,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
        });

        await click.save();

        res.status(201).json({
            success: true,
            message: 'Click recorded',
            data: click
        });
    } catch (error) {
        console.error('Error recording click:', error);
        res.status(500).json({ error: 'Failed to record click' });
    }
});

// Obtenir les statistiques globales
app.get('/api/stats', async (req, res) => {
    try {
        // Agréger les clics par lien
        const stats = await Click.aggregate([
            {
                $group: {
                    _id: '$linkName',
                    clicks: { $sum: 1 },
                    lastClick: { $max: '$timestamp' }
                }
            },
            {
                $sort: { clicks: -1 }
            }
        ]);

        // Calculer le total
        const totalClicks = stats.reduce((sum, stat) => sum + stat.clicks, 0);

        res.json({
            totalClicks,
            linksCount: stats.length,
            stats: stats.map(stat => ({
                name: stat._id,
                clicks: stat.clicks,
                lastClick: stat.lastClick
            }))
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Obtenir les statistiques pour un lien spécifique
app.get('/api/stats/:linkName', async (req, res) => {
    try {
        const { linkName } = req.params;

        const clicks = await Click.countDocuments({ linkName });
        const recentClicks = await Click.find({ linkName })
            .sort({ timestamp: -1 })
            .limit(10)
            .select('timestamp userAgent');

        res.json({
            linkName,
            totalClicks: clicks,
            recentClicks
        });
    } catch (error) {
        console.error('Error fetching link stats:', error);
        res.status(500).json({ error: 'Failed to fetch link stats' });
    }
});

// Réinitialiser toutes les statistiques (protégé)
app.delete('/api/stats', async (req, res) => {
    try {
        const { confirm } = req.body;

        if (confirm !== 'RESET_ALL_STATS') {
            return res.status(400).json({
                error: 'Confirmation required. Send { "confirm": "RESET_ALL_STATS" }'
            });
        }

        const result = await Click.deleteMany({});

        res.json({
            success: true,
            message: `${result.deletedCount} clicks deleted`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error resetting stats:', error);
        res.status(500).json({ error: 'Failed to reset stats' });
    }
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 API démarrée sur le port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Gestion de l'arrêt gracieux
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    await mongoose.connection.close();
    process.exit(0);
});
