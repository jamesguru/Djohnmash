// services/api.js
import axios from "axios";
const NEXT_PUBLIC_API_BASE_URL="https://api.niccydjonsspa.com/api/v1"

// const NEXT_PUBLIC_API_BASE_URL="http://localhost:8800/api/v1"

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getServices = async () => {
  try {
    const response = await api.get("/service");
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const bookAppointment = async (data:any) => {
  try {
    const response = await api.post("/booking", data);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};




export const addMember = async (data:any) => {
    console.log(data)
    try {
      const response = await api.post("/membership", data);
      return response.data;
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error;
    }
  };

  export const addService = async (data:any) => {
    console.log(data)
    try {
      const response = await api.post("/service", data);
      return response.data;
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error;
    }
  };


export const updateService = async (id: string, data: any) => {
  try {
    const response = await api.put(`/service/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};


export const AddEquipment = async (id: string, data: any) => {
  try {
    const response = await api.post(`/equipments`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};






  export const deleteService = async (id: string) => {
  try {
    const response = await api.delete(`/service/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};


  export const fetchServices = async () => {
    try {
      const response = await api.get("/service");
      return response.data;
    } catch (error) {
      console.error("Error getting services:", error);
      throw error;
    }
  };
  


export const leaveRating = async (data:any) => {
    try {
      const response = await api.post("/rating", data);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error;
    }
  };

  


  export const login = async (data:any) => {
    try {
      const response = await api.post("/auth/login", data);
      console.log(response.data)
      localStorage.setItem('user', JSON.stringify(response.data));     
     
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error;
    }
  };

  export const logout = async () => {
    localStorage.removeItem("user")
    
  };

  // Fetching data


  export const fetchMembers = async () => {
    try {
      const response = await api.get("/membership");
      return response.data;
    } catch (error) {
      console.error("Error getting members:", error);
      throw error;
    }
  };



  export const fetchBookings = async () => {
    try {
      const response = await api.get("/booking");
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  };


export const fetchRatings = async () => {
  try {
    const response = await api.get("/rating");
    return response.data;
  } catch (error) {
    console.error("Error getting ratings:", error);
    throw error;
  }
};


interface Equipment {
  id: string;
  name: string;
  type: string;
  image: string;
  lastMaintenance: string;
  status: 'checked-in' | 'checked-out' | 'maintenance' | 'missing';
  checkedBy: string | null;
  checkTime: string | null;
  notes: string | null;
  addedDate: string;
}

interface NewEquipment {
  name: string;
  type: string;
  image?: string;
  lastMaintenance: string;
}

interface EquipmentFilters {
  date?: Date | null
  search?: string;
  todayOnly?: boolean;
}

interface EquipmentStats {
  totalCount: number;
  checkedInToday: number;
  maintenanceCount: number;
  missingCount: number;
  maintenanceDueSoon: number;
  checkedInPercentage: number;
  missingPercentage: number;
}

const API_URL = "https://api.niccydjonsspa.com/api/v1/equipment"

export const getEquipment = async (filters: EquipmentFilters = {}): Promise<Equipment[]> => {
  const { date, search, todayOnly } = filters;
  const params = new URLSearchParams();
  
  if (date) params.append('date', date.toISOString());
  if (search) params.append('search', search);
  if (todayOnly) params.append('todayOnly', 'true');
  
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch equipment');
  return await response.json();
};

export const addEquipment = async (equipment: NewEquipment): Promise<Equipment> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...equipment,
      image: equipment.image || '/equipment/default.jpg'
    }),
  });
  if (!response.ok) throw new Error('Failed to add equipment');
  return await response.json();
};

export const updateEquipmentStatus = async (
  id: string | null,
  action: 'check-in' | 'maintenance' | 'missing' | null,
  notes: string,
  checkedBy: string
): Promise<Equipment> => {


  console.log("Update status", id, action, notes, checkedBy)
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, notes, checkedBy }),
  });
  if (!response.ok) throw new Error('Failed to update equipment status');
  return await response.json();
};

export const getEquipmentStats = async (): Promise<EquipmentStats> => {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) throw new Error('Failed to fetch equipment stats');
  return await response.json();
};


interface StaffAttendance {
  id: string;
  staffName: string;
  staffAvatar: string;
  position: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  hoursWorked: string | null;
  status: "present" | "absent" | "late" | "left-early";
}

interface NewStaff {
  staffName: string;
  position: string;
  date: any;
  staffAvatar?: string;
}

interface AttendanceFilters {
  date?: Date | null | string;
  search?: string;
  todayOnly?: boolean;
}

interface AttendanceStats {
  totalStaff: number;
  present: number;
  late: number;
  absent: number;
  working: number;
  presentPercentage: number;
  absentPercentage: number;
}

const ATTENDANCE_API_URL = "https://api.niccydjonsspa.com/api/v1/attendance";

export const getStaffAttendance = async (filters: AttendanceFilters = {}): Promise<StaffAttendance[]> => {
  const { date, search, todayOnly } = filters;
  const params = new URLSearchParams();
  
  if (date) params.append('date', date.toISOString());
  if (search) params.append('search', search);
  if (todayOnly) params.append('todayOnly', 'true');
  
  const response = await fetch(`${ATTENDANCE_API_URL}?${params.toString()}`);
  console.log(response)
  if (!response.ok) throw new Error('Failed to fetch attendance data');
  return await response.json();
};

export const addStaffMember = async (staff: NewStaff): Promise<StaffAttendance> => {
  const response = await fetch(ATTENDANCE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...staff,
      staffAvatar: staff.staffAvatar || '/avatars/default.jpg'
    }),
  });
  if (!response.ok) throw new Error('Failed to add staff member');
  return await response.json();
};

export const updateCheckinStatus = async (
  id: string,
  action: 'check-in' | 'check-out',
  notes?: string
): Promise<StaffAttendance> => {
  const response = await fetch(`${ATTENDANCE_API_URL}/${id}/checkin`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, notes }),
  });
  if (!response.ok) throw new Error('Failed to update attendance status');
  return await response.json();
};


export const updateCheckoutStatus = async (
  id: string,
  action: 'check-in' | 'check-out',
  notes?: string
): Promise<StaffAttendance> => {
  const response = await fetch(`${ATTENDANCE_API_URL}/${id}/checkout`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, notes }),
  });
  if (!response.ok) throw new Error('Failed to update attendance status');
  return await response.json();
};

export const getAttendanceStats = async (): Promise<AttendanceStats> => {
  const response = await fetch(`${ATTENDANCE_API_URL}/stats`);
  if (!response.ok) throw new Error('Failed to fetch attendance stats');
  return await response.json();
};

export const getStaffMember = async (id: string): Promise<StaffAttendance> => {
  const response = await fetch(`${ATTENDANCE_API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch staff member');
  return await response.json();
};

export const updateStaffMember = async (
  id: string,
  updates: Partial<NewStaff>
): Promise<StaffAttendance> => {
  const response = await fetch(`${ATTENDANCE_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update staff member');
  return await response.json();
};


