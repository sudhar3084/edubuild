import { fetchProjects as fetchFromBackend } from '../services/api';

/**
 * 🚀 BACKEND API CONNECTOR
 * This file acts as the bridge between the Express.js backend and the Frontend.
 * It is automatically connected to the Dashboard and Library pages.
 */

/**
 * Fetch projects from backend
 * This function is called by the frontend to get the latest data from the backend.
 * It ensures that every time you refresh the page, you get the latest project updates.
 */
export const fetchProjects = async (filters = {}) => {
    try {
        console.log("🔄 Fetching projects from backend...");
        const projects = await fetchFromBackend(filters);

        if (projects && projects.length > 0) {
            console.log(`✅ Fetch Complete: ${projects.length} projects loaded.`);
            return projects;
        }

        console.warn("⚠️ No projects available.");
        return [];
    } catch (error) {
        console.error("❌ Fetch Error: Failed to connect to backend.", error);
        return [];
    }
};
