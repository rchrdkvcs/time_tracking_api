import express from 'express';
import passport from "passport";
import User from '../models/User.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Récupérer le profil de l\'utilisateur connecté'
    // #swagger.responses[200] = { description: 'Profil utilisateur récupéré avec succès' }
    // #swagger.responses[401] = { description: 'Non autorisé' }

    // Exclure le mot de passe des informations renvoyées
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

router.get('/all', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Récupérer tous les utilisateurs (route admin)'
    // #swagger.responses[200] = { description: 'Liste des utilisateurs récupérée avec succès' }
    // #swagger.responses[401] = { description: 'Non autorisé' }
    // #swagger.responses[403] = { description: 'Accès refusé - Nécessite des droits administrateur' }

    // Vérifier si l'utilisateur est un administrateur
    if (!req.user.isAdmin) {
        return res.status(403).json({message: 'Accès refusé - Nécessite des droits administrateur'});
    }

    const users = await User.find().select('-password');
    res.json(users);
});

export default router;