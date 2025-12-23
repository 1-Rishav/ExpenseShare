const Group = require('../models/Group');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Public
const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;

        const group = await Group.create({
            name,
            members,
        });

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all groups (or filter by user)
// @route   GET /api/groups
// @access  Public
const getGroups = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) {
            query = { members: userId };
        }

        const groups = await Group.find(query).populate('members', 'name email');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Public
const getGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'name email');
        if (!group) return res.status(404).json({ message: 'Group not found' });
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createGroup,
    getGroups,
    getGroup
};
