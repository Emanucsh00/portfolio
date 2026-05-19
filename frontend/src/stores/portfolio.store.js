import { defineStore } from 'pinia';
import {
  createPortfolioItem,
  deletePortfolioItem,
  fetchPortfolioAdmin,
  fetchPortfolioItem,
  patchPortfolioStatus,
  updatePortfolioItem
} from '../services/portfolio.service';

function unwrapResponse(response) {
  return response?.data ?? response ?? {};
}

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
    loading: false,
    saving: false,
    error: ''
  }),
  actions: {
    async fetchItems(extra = {}) {
      this.loading = true;
      this.error = '';
      try {
        const response = unwrapResponse(await fetchPortfolioAdmin({
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.filters,
          ...extra
        }));
        this.items = response.items || [];
        this.pagination = {
          ...this.pagination,
          ...(response.pagination || {})
        };
        return this.items;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'No se pudo cargar el listado.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchItem(id) {
      const response = unwrapResponse(await fetchPortfolioItem(id));
      this.currentItem = {
        ...defaultPortfolioForm(),
        ...response,
        secondary_technologies: response.secondary_technologies || [],
        features: response.features || []
      };
      return this.currentItem;
    },
    resetCurrentItem() {
      this.currentItem = defaultPortfolioForm();
      this.error = '';
    },
    async saveCurrentItem() {
      this.saving = true;
      this.error = '';
      try {
        const payload = {
          ...this.currentItem,
          secondary_technologies: this.currentItem.secondary_technologies || [],
          features: this.currentItem.features || []
        };

        const response = this.currentItem.id
          ? unwrapResponse(await updatePortfolioItem(this.currentItem.id, payload))
          : unwrapResponse(await createPortfolioItem(payload));

        this.currentItem = {
          ...defaultPortfolioForm(),
          ...response,
          secondary_technologies: response.secondary_technologies || [],
          features: response.features || []
        };
        return this.currentItem;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'No se pudo guardar el registro.';
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async updateStatus(id, payload) {
      const response = unwrapResponse(await patchPortfolioStatus(id, payload));
      const index = this.items.findIndex((item) => item.id === id);

      if (index >= 0) {
        this.items[index] = {
          ...this.items[index],
          ...response
        };
      }

      return response;
    },
    async removeItem(id) {
      await deletePortfolioItem(id);
      this.items = this.items.filter((item) => item.id !== id);
    }
  }
});
