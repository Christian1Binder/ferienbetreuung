import { initRouter } from './router.js';
import store from './store.js';

// Entry Point
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Store (load from courses.js and SessionStorage)
    await store.init();

    // 2. Initialize Router
    // This will start listening for hash changes and render the correct page
    initRouter();

    // 3. Lucide Icons re-render on DOM updates
    // This is handled in the router's render function usually.
    // Or we can observe the document.
});
