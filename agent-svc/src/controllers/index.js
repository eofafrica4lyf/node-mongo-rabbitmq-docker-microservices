const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { firstName } = require('../entity/agent.entity');
const agentService = require('../service/agent.service');
const {checkStringField} = require('../validations/validations');

router.post(
    '/create', 
    [
        checkStringField('firstName', "First Name is required"),
        checkStringField('lastName', "Last Name is required"),
        checkStringField('startTime', "Start Time is required"),
        checkStringField('endTime', "End Time is required"),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationErrors = errors.array().filter((v) => v);
            return res.status(400).send({ errors: validationErrors });
        }

        const {firstName, lastName, startTime, endTime} = req.body;
        await agentService.create({firstName, lastName, startTime, endTime});
        return res.status(201).send("Agent created successfully");
    } catch (error) {
        console.log(error);
        return res.status(400).json("An error occured!");
    }
})

router.put(
    '/update', 
    [
        checkStringField('firstName', "First Name is required"),
        checkStringField('lastName', "Last Name is required"),
        checkStringField('startTime', "Start Time is required"),
        checkStringField('endTime', "End Time is required"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const validationErrors = errors.array().filter((v) => v);
                return res.status(400).send({ errors: validationErrors });
            }
    
            const {firstName, lastName, startTime, endTime} = req.body;
    
            await agentService.update({firstName, lastName, startTime, endTime});
            return res.status(200).send("Agent updated successfully");
        } catch (error) {
            console.log(error);
            return res.status(400).json("An error occured!");
        }
})

router.get((
    '/',
    async (req, res) => {
        try {
            const {ids} = req.query;
            const agents = await agentService.getAll(ids.split(',').filter(item => Number(item)));
            return res.status(200).json(agents);
        } catch (error) {
            console.log(error);
            return res.status(400).json("An error occured!");
        }
    }
))

router.get((
    '/:id',
    async (req, res) => {
        try {
            const {id} = req.params;
            const agent = await agentService.getSingleAgent(id);
            return res.status(200).json(agent);
        } catch (error) {
            console.log(error);
            return res.status(400).json("An error occured!");
        }
    }
))

module.exports = router;