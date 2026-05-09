// Import Trial model
const Trial  = require('../models/trialModel');

// Import Player model to find player profile
const Player = require('../models/playerModel');

// -----------------------------------------------
// CREATE TRIAL CONTROLLER
// Requirement 4.2 - Trial/Camp Application System
// Only Coach and Admin can create trials
// POST /api/trials
// -----------------------------------------------
const createTrial = async (req, res) => {
  try {
    const { title, description, location, trialDate } = req.body;

    // Create the trial
    const trial = await Trial.create({
      title,
      description,
      location,
      trialDate,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: 'Trial created successfully ✅',
      trial,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET ALL TRIALS CONTROLLER
// All logged in users can view trials
// GET /api/trials
// -----------------------------------------------
const getTrials = async (req, res) => {
  try {
    const trials = await Trial.find()
      .populate('createdBy', 'name role')
      .sort({ trialDate: 1 });

    res.status(200).json({
      message: 'Trials fetched successfully ✅',
      count:   trials.length,
      trials,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// APPLY FOR TRIAL CONTROLLER
// Requirement 4.2 - Player applies for a trial
// Only Players can apply
// POST /api/trials/:id/apply
// -----------------------------------------------
const applyForTrial = async (req, res) => {
  try {
    // Find the trial
    const trial = await Trial.findById(req.params.id);

    if (!trial) {
      return res.status(404).json({ message: 'Trial not found ❌' });
    }

    // Find the player profile of the logged in user
    const player = await Player.findOne({ addedBy: req.user.id });

    if (!player) {
      return res.status(404).json({
        message: 'You need to create a player profile first ❌'
      });
    }

    // Check if player already applied
    const alreadyApplied = trial.applications.find(
      app => app.appliedBy.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        message: 'You have already applied for this trial ❌'
      });
    }

    // Add the application
    trial.applications.push({
      player:    player._id,
      appliedBy: req.user.id,
      status:    'Pending',
    });

    await trial.save();

    res.status(201).json({
      message: 'Applied for trial successfully ✅',
      trial,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// UPDATE APPLICATION STATUS CONTROLLER
// Coach/Admin can accept or reject applications
// PUT /api/trials/:id/applications/:appId
// -----------------------------------------------
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Find the trial
    const trial = await Trial.findById(req.params.id);

    if (!trial) {
      return res.status(404).json({ message: 'Trial not found ❌' });
    }

    // Find the specific application
    const application = trial.applications.id(req.params.appId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found ❌' });
    }

    // Update application status
    application.status = status;
    if (notes) application.notes = notes;

    await trial.save();

    res.status(200).json({
      message: 'Application status updated ✅',
      trial,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET MY APPLICATIONS CONTROLLER
// Player can see their own applications
// GET /api/trials/myapplications
// -----------------------------------------------
const getMyApplications = async (req, res) => {
  try {
    // Find all trials where this user applied
    const trials = await Trial.find({
      'applications.appliedBy': req.user.id,
    }).populate('createdBy', 'name role');

    // Extract only this user's applications
    const myApplications = trials.map(trial => {
      const myApp = trial.applications.find(
        app => app.appliedBy.toString() === req.user.id
      );
      return {
        trialId:     trial._id,
        trialTitle:  trial.title,
        location:    trial.location,
        trialDate:   trial.trialDate,
        createdBy:   trial.createdBy,
        status:      myApp.status,
        appliedAt:   myApp.appliedAt,
        notes:       myApp.notes,
      };
    });

    res.status(200).json({
      message:        'My applications fetched ✅',
      myApplications,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = {
  createTrial,
  getTrials,
  applyForTrial,
  updateApplicationStatus,
  getMyApplications,
};