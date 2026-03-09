import type { Checkpoint, Wisdom, Tool } from "../models/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const journeyService = {
  getAll: async (): Promise<Checkpoint[]> => {
    const response = await fetch(`${API_BASE_URL}/journey`);
    if (!response.ok) throw new Error("Failed to fetch checkpoints");
    return response.json();
  },

  update: async (
    step: number,
    data: { done: boolean; memo: string | null },
  ): Promise<Checkpoint> => {
    const response = await fetch(`${API_BASE_URL}/journey/${step}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update checkpoint");
    return response.json();
  },
};

export const wisdomService = {
  getAll: async (): Promise<Wisdom[]> => {
    const response = await fetch(`${API_BASE_URL}/wisdom`);
    if (!response.ok) throw new Error("Failed to fetch wisdom");
    return response.json();
  },

  getFeatured: async (): Promise<Wisdom> => {
    const response = await fetch(`${API_BASE_URL}/wisdom/featured`);
    if (!response.ok) throw new Error("Failed to fetch featured wisdom");
    return response.json();
  },

  star: async (id: number): Promise<Wisdom> => {
    const response = await fetch(`${API_BASE_URL}/wisdom/${id}/star`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to star wisdom");
    return response.json();
  },
};

export const toolkitService = {
  getAll: async (): Promise<Tool[]> => {
    const response = await fetch(`${API_BASE_URL}/toolkit`);
    if (!response.ok) throw new Error("Failed to fetch tools");
    return response.json();
  },

  rate: async (id: number): Promise<Tool> => {
    const response = await fetch(`${API_BASE_URL}/toolkit/${id}/rate`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to rate tool");
    return response.json();
  },
};
