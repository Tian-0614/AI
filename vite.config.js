import path from "path";
import { defineConfig, loadEnv } from 'vite'
import vue from "@vitejs/plugin-vue";
const pathSrc = path.resolve(__dirname, "src");

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 
    // `VITE_` 前缀。
    const env = loadEnv(mode, process.cwd(), '')
    return {
        server: {
            host: '0.0.0.0',
            port: 8080,
            open: true,
            cors: true,  
        },
        // dev 独有配置
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
        build: {
            lib: {
                entry: 'src/index.js',
                name: 'Ai',
                fileName: (format) => `ai.${format}.js`
            },
            rollupOptions: {
                // 确保外部化处理那些你不想打包进库的依赖
                external: ['vue'],
                output: {
                    name: 'Ai',
                    format: 'umd',
                    // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                    globals: {
                        vue: 'Vue'
                    }
                },
            },
            outDir: 'C:/Users/jike/Desktop/vite-html/dist',
        },
        resolve: {
            alias: {
                "@/": `${pathSrc}/`,
            },
        },
        plugins: [vue(),],
    }
})