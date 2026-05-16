import { defineStore } from 'pinia';
import {
  createPortfolioItem,
  deletePortfolioItem,
  fetchPortfolioAdmin,
  fetchPortfolioItem,
  patchPortfolioStatus,
  updatePortfolioItem
} from '../services/portfolio.service';

export const defaultPortfolioForm = () => ({
  title: '',
  subtitle: '',
  slug: '',
  summary: '',
  description: '',
  category: '',
  project_type: '',
  main_technology: '',
  secondary_technologies: [],
  repository_url: '',
  demo_url: '',
  image_url: '',
  client_name: '',
  role_performed: '',
  difficulty_level: '',
  objective: '',
  result: '',
  learnings: '',
  features: [],
  start_date: '',
  end_date: '',
  status: 'draft',
  is_public: false,
  display_order: 0,
  internal_notes: ''
});

export const usePortfolioStore = defineStore('portfolio', {
  state: () => ({
    items: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    },
    filters: {
      search: '',
      status: '',
      category: '',
      isPublic: ''
    },
    currentItem: defaultPortfolioForm(),
    loading: false
  }),
  actions: {
    async fetchItems(extra = {}) {
      this.loading = true;
      try {
        const response = await fetchPortfolioAdmin({
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.filters,
          ...extra
        });
        this.items = response.data.items;
        this.pagination = response.data.pagination;
      } finally {
        this.loading = false;
      }
    },
    async fetchItem(id) {
      const response = await fetchPortfolioItem(id);
      this.currentItem = response.data;
      return response.data;
    },
    resetCurrentItem() {
      this.currentItem = defaultPortfolioForm();
    },
    async saveCurrentItem() {
      if (this.currentItem.id) {
        const response = await updatePortfolioItem(this.currentItem.id, this.currentItem);
        return response.data;
      }

      const response = await createPortfolioItem(this.currentItem);
      return response.data;
    },
    async updateStatus(id, payload) {
      const response = await patchPortfolioStatus(id, payload);
      return response.data;
    },
    async removeItem(id) {
      await deletePortfolioItem(id);
    }
  }
});
