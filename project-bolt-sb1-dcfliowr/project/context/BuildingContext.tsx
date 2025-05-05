import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Building } from '@/types/building';

type BuildingContextType = {
  buildings: Building[];
  addBuilding: (building: Building) => Promise<void>;
  updateBuilding: (building: Building) => Promise<void>;
  deleteBuilding: (id: string) => Promise<void>;
  getBuildingById: (id: string) => Building | undefined;
  updateLastViewed: (id: string) => Promise<void>;
  getRecentBuildings: () => Promise<Building[]>;
  importBuildings: (buildings: Building[]) => Promise<void>;
  clearAllBuildings: () => Promise<void>;
};

const BuildingContext = createContext<BuildingContextType>({
  buildings: [],
  addBuilding: async () => {},
  updateBuilding: async () => {},
  deleteBuilding: async () => {},
  getBuildingById: () => undefined,
  updateLastViewed: async () => {},
  getRecentBuildings: async () => [],
  importBuildings: async () => {},
  clearAllBuildings: async () => {},
});

const STORAGE_KEY = 'zilmatik_buildings';
const MAX_RECENT_BUILDINGS = 5;

export const BuildingProvider = ({ children }: { children: ReactNode }) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  
  useEffect(() => {
    loadBuildings();
  }, []);
  
  const loadBuildings = async () => {
    try {
      const storedBuildings = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedBuildings) {
        setBuildings(JSON.parse(storedBuildings));
      }
    } catch (error) {
      console.error('Error loading buildings', error);
    }
  };
  
  const saveBuildings = async (updatedBuildings: Building[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBuildings));
      setBuildings(updatedBuildings);
    } catch (error) {
      console.error('Error saving buildings', error);
    }
  };
  
  const addBuilding = async (building: Building) => {
    const updatedBuildings = [...buildings, building];
    await saveBuildings(updatedBuildings);
  };
  
  const updateBuilding = async (building: Building) => {
    const index = buildings.findIndex((b) => b.id === building.id);
    if (index !== -1) {
      const updatedBuildings = [...buildings];
      updatedBuildings[index] = building;
      await saveBuildings(updatedBuildings);
    }
  };
  
  const deleteBuilding = async (id: string) => {
    const updatedBuildings = buildings.filter((building) => building.id !== id);
    await saveBuildings(updatedBuildings);
  };
  
  const getBuildingById = (id: string) => {
    return buildings.find((building) => building.id === id);
  };
  
  const updateLastViewed = async (id: string) => {
    const index = buildings.findIndex((b) => b.id === id);
    if (index !== -1) {
      const updatedBuildings = [...buildings];
      updatedBuildings[index] = {
        ...updatedBuildings[index],
        lastViewed: new Date().toISOString()
      };
      await saveBuildings(updatedBuildings);
    }
  };
  
  const getRecentBuildings = async () => {
    return buildings
      .sort((a, b) => {
        return new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime();
      })
      .slice(0, MAX_RECENT_BUILDINGS);
  };
  
  const importBuildings = async (importedBuildings: Building[]) => {
    await saveBuildings(importedBuildings);
  };
  
  const clearAllBuildings = async () => {
    await saveBuildings([]);
  };
  
  return (
    <BuildingContext.Provider value={{
      buildings,
      addBuilding,
      updateBuilding,
      deleteBuilding,
      getBuildingById,
      updateLastViewed,
      getRecentBuildings,
      importBuildings,
      clearAllBuildings
    }}>
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildings = () => useContext(BuildingContext);