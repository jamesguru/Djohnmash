import Service from '../models/Service.js';

export const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getServices = async (req, res) => {
  try {
    // Sort by `createdAt` descending (-1) to get latest first
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const updateService = async (req,res) =>{
  try {
  const { id } = req.params;
  const updateData = req.body;
  const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });
  res.json(updatedService);   
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}


export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);
    
    if (!deletedService) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully', deletedService });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};