import Equipment from '../models/Equipment.js';

// Get all equipment with optional filters
export const getAllEquipment = async (req, res) => {
  try {
    const { date, search, todayOnly } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Date filter
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.addedDate = { $gte: startDate, $lte: endDate };
    }
    
    // Today only filter
    if (todayOnly === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      query.addedDate = { $gte: today, $lt: tomorrow };
    }
    
    const equipment = await Equipment.find(query).sort({ addedDate: -1 });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new equipment
export const createEquipment = async (req, res) => {
  try {
    const { name, type, image, lastMaintenance } = req.body;
    
    const equipment = new Equipment({
      name,
      type,
      image: image || '/equipment/default.jpg',
      lastMaintenance: new Date(lastMaintenance),
      status: 'checked-out'
    });
    
    const newEquipment = await equipment.save();
    res.status(201).json(newEquipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update equipment status
export const updateEquipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes, checkedBy } = req.body;
    
    const update = {
      notes: notes || getDefaultNote(action),
      checkedBy,
      checkTime: new Date()
    };
    
    switch (action) {
      case 'check-in':
        update.status = 'checked-in';
        break;
      case 'maintenance':
        update.status = 'maintenance';
        break;
      case 'missing':
        update.status = 'missing';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
    
    if (!updatedEquipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    res.json(updatedEquipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get equipment statistics
export const getEquipmentStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [totalCount, checkedInToday, maintenanceCount, missingCount] = await Promise.all([
      Equipment.countDocuments(),
      Equipment.countDocuments({
        status: 'checked-in',
        checkTime: { $gte: today, $lt: tomorrow }
      }),
      Equipment.countDocuments({ status: 'maintenance' }),
      Equipment.countDocuments({ status: 'missing' })
    ]);
    
    // Maintenance due soon (last maintenance > 25 days ago)
    const maintenanceDueSoon = await Equipment.countDocuments({
      lastMaintenance: { $lt: new Date(Date.now() - 86400000 * 25) },
      status: { $ne: 'maintenance' }
    });
    
    res.json({
      totalCount,
      checkedInToday,
      maintenanceCount,
      missingCount,
      maintenanceDueSoon,
      checkedInPercentage: totalCount ? Math.round((checkedInToday / totalCount) * 100) : 0,
      missingPercentage: totalCount ? Math.round((missingCount / totalCount) * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

function getDefaultNote(action) {
  switch (action) {
    case 'check-in': return 'No issues reported';
    case 'maintenance': return 'Maintenance required';
    case 'missing': return 'Reported missing';
    default: return '';
  }
}