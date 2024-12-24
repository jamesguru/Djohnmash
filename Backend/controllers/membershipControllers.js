import Membership from '../models/Membership.js';

export const joinMembership = async (req, res) => {
  try {
    const membership = new Membership(req.body);
    await membership.save();
    res.status(201).json(membership);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const cancelMembership = async (req, res) => {
    try {
      const membership = await Membership.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
      if (!membership) throw new Error('Membership not found');
      res.json(membership);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };

  export const getMemberships = async (req, res) => {
    try {
      const memberships = await Membership.find();
      res.json(memberships);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };