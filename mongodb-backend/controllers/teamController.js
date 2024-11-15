import Team from '../models/teamModel.js'; // assuming a Team model is defined
import User from '../models/userModel.js'; // assuming a User model is defined
import Challenge from '../models/challengeModel.js'; // assuming a Challenge model is defined

// Controller function to create a new team
export const createTeam = async (req, res) => {
  try {
    const { name, description, challengeId } = req.body;
    console.log('Creating team with data:', { name, description, challengeId }); // Debug log

    // Validate required fields
    if (!name || !challengeId) {
      return res.status(400).json({ 
        message: 'Team name and challenge ID are required',
        received: { name, challengeId }
      });
    }

    // Validate user authentication
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User authentication failed' });
    }

    // Verify the challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const userId = req.user.userId;

    const newTeam = new Team({
      name,
      description,
      challengeId,
      members: [userId],
      createdBy: userId,
    });

    const savedTeam = await newTeam.save();
    
    // Populate the saved team with member details
    const populatedTeam = await Team.findById(savedTeam._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Team created successfully',
      team: populatedTeam
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ 
      message: 'An error occurred while creating the team',
      error: error.message 
    });
  }
};



export const addMemberToTeam = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find the team by ID
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (team.members.some(memberId => memberId.toString() === String(userId))) {
      console.log('User is already a member'); // Debugging log for confirmation
      return res.status(400).json({ message: 'User is already a member of the team' });
    }

    // Add the user to the team members
    team.members.push(userId);
    await team.save();

    res.status(200).json({ message: 'User added to the team successfully', team });
  } catch (error) {
    console.error('Error adding member to team:', error);
    res.status(500).json({ message: 'An error occurred while adding the member to the team' });
  }
};
// controllers/teamController.js
export const sendMessageToTeam = async (req, res) => {
  const { teamId } = req.params;
  const { message } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const newMessage = {
      sender: req.user.userId,  // Access userId from req.user
      message,
      timestamp: new Date(),
    };

    team.messages.push(newMessage);
    await team.save();
    res.status(200).json({ message: 'Message sent', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all messages for a specific team
export const getTeamMessages = async (req, res) => {
  const { teamId } = req.params;

  try {
    // Find the team and populate messages with the sender's details
    const team = await Team.findById(teamId).populate('messages.sender', 'name email');
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Send the messages array as the response
    res.status(200).json(team.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific team by ID
export const getTeamById = async (req, res) => {
  const { teamId } = req.params;

  try {
    // Find the team by ID and populate members and challenges details
    const team = await Team.findById(teamId)
      .populate('members', 'name email role') // Populating members' basic info
      .populate('challenges'); // Optionally populate the challenges field

    if (!team) return res.status(404).json({ message: 'Team not found' });

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all teams with optional pagination
export const getAllTeams = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Defaults for pagination

  try {
    // Find all teams with pagination and populate members with basic info
    const teams = await Team.find()
      .populate('members', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get the total count of teams for pagination
    const totalTeams = await Team.countDocuments();

    res.status(200).json({
      teams,
      currentPage: page,
      totalPages: Math.ceil(totalTeams / limit),
      totalTeams,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a member from a team
export const removeMemberFromTeam = async (req, res) => {
  const { teamId } = req.params;
  const { memberId } = req.body; // Member ID to be removed is passed in the request body

  try {
    // Find the team by ID
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Check if the member exists in the team
    const memberIndex = team.members.indexOf(memberId);
    if (memberIndex === -1) return res.status(404).json({ message: 'Member not found in team' });

    // Remove the member from the team
    team.members.splice(memberIndex, 1);
    await team.save();

    res.status(200).json({ message: 'Member removed successfully', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a team
export const deleteTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    // Find the team by ID and delete it
    const team = await Team.findByIdAndDelete(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamsByChallengeId = async (req, res) => {
  const { challengeId } = req.params;

  try {
    const teams = await Team.find({ challengeId })
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
