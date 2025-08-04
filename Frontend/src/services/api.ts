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





