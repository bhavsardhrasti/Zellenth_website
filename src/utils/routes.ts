export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DOORS: '/doors',
  DOORS_ID: (id: string) => `/doors/${id}`,
  LAMINATES: '/laminates',
  LAMINATES_ID: (id: string) => `/laminates/${id}`,
  VISUALIZER: '/visualizer',
  WATCHLIST: '/watchlist',
};
