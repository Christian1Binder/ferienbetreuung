// Layout Component
export function Layout(content) {
    const el = document.createElement('div');
    el.className = 'min-h-screen bg-gray-50 flex flex-col';

    import('./Header.js').then(({ Header }) => {
        el.prepend(Header());
    });

    import('./Sidebar.js').then(({ Sidebar }) => {
         const sidebar = Sidebar();
         // Wrapper for main content
         const wrapper = document.createElement('div');
         wrapper.className = 'flex flex-1 relative pt-16'; // Header height
         wrapper.appendChild(sidebar);

         const main = document.createElement('main');
         main.className = 'flex-1 w-full p-4 lg:p-8 overflow-y-auto lg:ml-64'; // Sidebar width
         const inner = document.createElement('div');
         inner.className = 'max-w-7xl mx-auto';
         inner.appendChild(content);
         main.appendChild(inner);

         wrapper.appendChild(main);
         el.appendChild(wrapper);
    });

    return el;
}
