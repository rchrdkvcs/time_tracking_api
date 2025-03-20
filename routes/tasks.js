import express from 'express';
import passport from "passport";
import Task from '../models/Task.js';
import Project from '../models/Project.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Tasks']
    // #swagger.description = 'Récupérer toutes les tâches de l\'utilisateur authentifié'
    // #swagger.responses[200] = { description: 'Tâches récupérées avec succès' }
    // #swagger.responses[401] = { description: 'Non autorisé' }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({user: req.user._id});
    const projectIds = projects.map(project => project._id);

    const totalTasks = await Task.countDocuments({project: {$in: projectIds}});

    const tasks = await Task.find({project: {$in: projectIds}})
        .populate('project')
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1});

    ('project');

    res.json({
        tasks,
        pagination: {
            total: totalTasks,
            page,
            limit,
            pages: Math.ceil(totalTasks / limit)
        }
    });
});

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Tasks']
    // #swagger.description = 'Créer une nouvelle tâche'
    // #swagger.parameters['projectId'] = { in: 'query', description: 'ID du projet', required: true, type: 'string' }
    // #swagger.parameters['body'] = { in: 'body', description: 'Données de la tâche', required: true, schema: { $ref: '#/definitions/Task' } }
    // #swagger.responses[201] = { description: 'Tâche créée avec succès' }
    // #swagger.responses[400] = { description: 'Erreur lors de la création de la tâche' }
    // #swagger.responses[401] = { description: 'Non autorisé' }
    // #swagger.responses[403] = { description: 'Interdit - l\'utilisateur n\'a pas la permission' }
    // #swagger.responses[404] = { description: 'Projet non trouvé' }

    try {
        const project = await Project.findById(req.query.projectId);

        if (!project) {
            return res.status(404).json({message: 'Ce projet n\'existe pas'});
        }
        if (project.user === undefined || !project.user.equals(req.user._id)) {
            return res.status(403).json({message: 'Vous n\'avez pas le droit d\'ajouter une tâche à ce projet'});
        }

        const task = new Task({...req.body, project: req.query.projectId});
        await task.save();

        await Project.findByIdAndUpdate(req.query.projectId, {
            $push: {tasks: task._id}
        });

        res.status(201).json(task);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Erreur lors de la création de la tâche'});
    }
});

router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Tasks']
    // #swagger.description = 'Récupérer une tâche spécifique par son ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID de la tâche', required: true, type: 'string' }
    // #swagger.responses[200] = { description: 'Tâche récupérée avec succès' }
    // #swagger.responses[400] = { description: 'ID invalide' }
    // #swagger.responses[401] = { description: 'Non autorisé' }
    // #swagger.responses[403] = { description: 'Interdit - l\'utilisateur n\'a pas la permission' }
    // #swagger.responses[404] = { description: 'Tâche non trouvée' }

    try {
        const task = await Task.findById(req.params.id).populate('project');
        if (task === null) {
            res.status(404).json({message: 'Cette tâche n\'existe pas'});
        } else if (!task.project || !task.project.user || !task.project.user.equals(req.user._id)) {
            res.status(403).json({message: 'Vous n\'avez pas le droit d\'accéder à cette tâche'});
        } else {
            res.json(task);
        }
    } catch (error) {
        res.status(400).json({message: 'Invalid ID'});
    }
});

router.put('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Tasks']
    // #swagger.description = 'Mettre à jour une tâche'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID de la tâche', required: true, type: 'string' }
    // #swagger.parameters['body'] = { in: 'body', description: 'Données mises à jour de la tâche', required: true } }
    // #swagger.responses[200] = { description: 'Tâche mise à jour avec succès' }
    // #swagger.responses[400] = { description: 'ID invalide' }
    // #swagger.responses[401] = { description: 'Non autorisé' }
    // #swagger.responses[403] = { description: 'Interdit - l\'utilisateur n\'a pas la permission' }
    // #swagger.responses[404] = { description: 'Tâche non trouvée' }

    try {
        let task = await Task.findById(req.params.id).populate('project');
        if (task === null) {
            res.status(404).json({message: 'Cette tâche n\'existe pas'});
        } else if (!task.project || !task.project.user || !task.project.user.equals(req.user._id)) {
            res.status(403).json({message: 'Vous n\'avez pas le droit de modifier cette tâche'});
        } else {
            task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
            res.json(task);
        }
    } catch (error) {
        res.status(400).json({message: 'Invalid ID'});
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // #swagger.tags = ['Tasks']
    // #swagger.description = 'Supprimer une tâche'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID de la tâche', required: true, type: 'string' }
    // #swagger.responses[200] = { description: 'Tâche supprimée avec succès' }
    // #swagger.responses[400] = { description: 'ID invalide' }
    // #swagger.responses[401] = { description: 'Non autorisé' }
    // #swagger.responses[403] = { description: 'Interdit - l\'utilisateur n\'a pas la permission' }
    // #swagger.responses[404] = { description: 'Tâche non trouvée' }

    try {
        const task = await Task.findById(req.params.id).populate('project');
        if (task === null) {
            res.status(404).json({message: 'Cette tâche n\'existe pas'});
        } else if (!task.project || !task.project.user || !task.project.user.equals(req.user._id)) {
            res.status(403).json({message: 'Vous n\'avez pas le droit de supprimer cette tâche'});
        } else {
            await Project.findByIdAndUpdate(task.project._id, {
                $pull: {tasks: task._id}
            });

            await Task.findByIdAndDelete(req.params.id);
            res.json({message: 'Tâche supprimée avec succès'});
        }
    } catch (error) {
        res.status(400).json({message: 'Invalid ID'});
    }
});

export default router;