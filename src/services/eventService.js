import { apiService } from './api';

export const eventService = {
  async getFeaturedEvents() {
    try {
      return await apiService.getEvents({ featured: true });
    } catch (error) {
      throw new Error('Failed to fetch featured events');
    }
  },

  async getEventsByCategory(category) {
    try {
      return await apiService.getEvents({ category });
    } catch (error) {
      throw new Error(`Failed to fetch ${category} events`);
    }
  },

  async searchEvents(query) {
    try {
      return await apiService.getEvents({ search: query });
    } catch (error) {
      throw new Error('Failed to search events');
    }
  }
};