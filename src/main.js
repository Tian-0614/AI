import { createApp } from "vue";
import App from './App.vue'
let app = createApp(App);
import 'element-plus/dist/index.css';
import element from 'element-plus';
app.use(element);
import { MotionPlugin } from '@vueuse/motion'
app.use(MotionPlugin)

app.mount('#app')
export default app;
