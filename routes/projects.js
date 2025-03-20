import express from 'express';
import passport from "passport";
import Project from '../models/Project.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'Récupérer tous les projets de l\'utilisateur authentifié'
    // #swagger.responses[200] = { description: 'Projets récupérés avec succès' }
    // #swagger.responses[401] = { description: 'Non autorisé' }

    const projects = await Project.find({user: req.user._id});

    res.json(projects);
});

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'Créer un nouveau projet'
    // #swagger.parameters['body'] = { in: 'body', description: 'Données du projet', required: true }
    // #swagger.responses[201] = { description: 'Projet créé avec succès' }
    // #swagger.responses[400] = { description: 'Erreur lors de la création du projet' }
    // #swagger.responses[401] = { description: 'Non autorisé' }

    const project = new Project({...req.body, user: req.user._id});

    await project.save();

    res.status(201).json(project);
});

router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'Récupérer un projet spécifique par son ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID du projet', required: true, type: 'string' }
    // #swagger.responses[200] = { description: 'Projet récupéré avec succès' }
    // #swagger.responses[400] = { description: 'ID invalide' }
    // #swagger.responses[401] = { description: 'Non autorisé' }
    // #swagger.responses[403] = { description: 'Interdit - l\'utilisateur n\'a pas la permission' }
    // #swagger.responses[404] = { description: 'Projet non trouvé' }

    try {
        const project = await Project.findById(req.params.id);

        if (project === null) {
            res.status(404).json({message: 'Ce projet n\'existe pas'});
        } else if (project.user === undefined || !project.user.equals(req.user._id)) {
            res.status(403).json({message: 'Vous n\'avez pas le droit d\'accéder à ce projet'});
        } else {
            res.json(project);
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'invalid id'});
    }
});

router.put('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'Mettre à jour un projet'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID du projet', required: true, type: 'string' }
    // #swagger.parameters['body'] = { in: 'body', description: 'Données mises à jour du projet', required: true }
    // #swagger.responses[200] = { description: 'Projet mis à jour avec succès' }
    // #swagger.responses[400] = { description: 'ID invalide' }
    // #swagger.responses[401] = { description: 'Non autorisé' }
    // #swagger.responses[403] = { description: 'Interdit - l\'utilisateur n\'a pas la permission' }
    // #swagger.responses[404] = { description: 'Projet non trouvé' }

    try {
        const project = await Project.findById(req.params.id);

        if (project === null) {
            res.status(404).json({message: 'Ce projet n\'existe pas'});
        } else if (project.user === undefined || !project.user.equals(req.user._id)) {
            res.status(403).json({message: 'Vous n\'avez pas le droit de modifier ce projet'});
        } else {
            project = await Project.findByIdAndUpdate(req.params.id, req.body, {new: true});
            res.json(project);
        }

    } catch (error) {
        res.status(400).json({message: 'invalid id'});
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'Supprimer un projet'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID du projet', required: true, type: 'string' }
    // #swagger.responses[200] = { description: 'Projet supprimé avec succès' }
    // #swagger.responses[400] = { description: 'ID invalide' }
    // #swagger.responses[401] = { description: 'Non autorisé' }
    // #swagger.responses[403] = { description: 'Interdit - l\'utilisateur n\'a pas la permission' }
    // #swagger.responses[404] = { description: 'Projet non trouvé' }

    try {
        const project = await Project.findById(req.params.id);

        if (project === null) {
            res.status(404).json({message: 'Ce projet n\'existe pas'});
        } else if (project.user === undefined || !project.user.equals(req.user._id)) {
            res.status(403).json({message: 'Vous n\'avez pas le droit de modifier ce projet'});
        } else {
            await Project.findByIdAndDeconste(req.params.id);
            res.json({message: 'Projet supprimé avec succès'});
        }
        
    } catch (error) {
        res.status(400).json({message: 'invalid id'});
    }
});

export default router;