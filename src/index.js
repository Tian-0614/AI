import { createApp } from 'vue';
import TXiaoXin2 from './components/t-xiaoxin-v2.vue';
// import 'element-plus/dist/index.css';
// import element from 'element-plus';
import { MotionPlugin } from '@vueuse/motion'

const Ai = {
    install(app) {
        app.component(TXiaoXin2.name, TXiaoXin2);
    },
    renderComponent(containerId,option = {}) {
        const container = document.getElementById(containerId);
        if (container) {
            option.container = container;
            const app = createApp(TXiaoXin2,option);
            app.use(MotionPlugin)
            return app.mount(container);
        }
    },
};

// 自动安装
if (typeof window !== 'undefined' && window.Vue) {
    window.Ai = Ai;
    // window.Vue.use(MyLibrary);
}

export default Ai;