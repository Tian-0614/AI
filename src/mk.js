import { createApp } from 'vue';
import markdown from './components/markdown.vue';
const Markdown = {
    install(app) {
        app.component(markdown.name, markdown);
    },
    renderComponent(containerId,option = {}) {
        const container = document.getElementById(containerId);
        if (container) {
            option.container = container;
            const app = createApp(markdown,option);
            return app.mount(container);
        }
    },
};

// 自动安装
if (typeof window !== 'undefined' && window.Vue) {
    window.Markdown = Markdown;
    // window.Vue.use(MyLibrary);
}

export default Markdown;