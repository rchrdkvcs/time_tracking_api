import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Créer un nouveau compte utilisateur'
    // #swagger.parameters['body'] = { in: 'body', description: 'Informations d\'inscription', required: true, schema: { email: 'user@example.com', username: 'username', password: 'password' } }
    // #swagger.responses[200] = { description: 'Utilisateur enregistré avec succès' }
    // #swagger.responses[400] = { description: 'Erreur lors de l\'inscription' }

    User.register(
        new User({
            email: req.body.email,
            username: req.body.username
        }), req.body.password, function (err, user) {
            if (err) {
                res.json(err);
            } else {
                res.json(user);
            }
        }
    );
});

router.post("/login", async (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Connecter un utilisateur et obtenir un token JWT'
    // #swagger.parameters['body'] = { in: 'body', description: 'Identifiants de connexion', required: true, schema: { username: 'username', password: 'password' } }
    // #swagger.responses[200] = { description: 'Connexion réussie, token JWT renvoyé' }
    // #swagger.responses[400] = { description: 'Échec de la connexion' }

    const {user} = await User.authenticate()(req.body.username, req.body.password);
    if (user) {
        const payload = {
            id: user.id,
            expire: Date.now() + 1000 * 60 * 60 * 24 * 7
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET)

        res.json({token: token});
    } else {
        res.json({error: 'Can\'t connect!'});
    }
});

export default router;