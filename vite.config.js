import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                aboutUs: resolve(__dirname, 'src/pages/aboutUs.html'),
                adminPage: resolve(__dirname, 'src/pages/adminPage.html'),
                adminPanel: resolve(__dirname, 'src/pages/adminPanel.html'),
                catalog: resolve(__dirname, 'src/pages/catalog.html'),
            }
        }
    },
    plugins: [
        {
            name: 'copy-js-files',
            closeBundle() {
                // Создаем структуру папок в dist
                fs.mkdirSync(resolve(__dirname, 'dist/src'), { recursive: true });
                fs.mkdirSync(resolve(__dirname, 'dist/src/animation'), { recursive: true });
    
                // Копируем конкретные файлы
                const filesToCopy = [
                    { from: 'src/catalogLogic.js', to: 'dist/src/catalogLogic.js' },
                    { from: 'src/animation/wow.min.js', to: 'dist/src/animation/wow.min.js' },
                    { from: 'src/adminLogic.js', to: 'dist/src/adminLogic.js' } // Добавляем эту строку
                ];
    
                filesToCopy.forEach(file => {
                    if (fs.existsSync(file.from)) {
                        fs.copyFileSync(
                            resolve(__dirname, file.from),
                            resolve(__dirname, file.to)
                        );
                        console.log(`Скопировано ${file.from} в ${file.to}`);
                    } else {
                        console.warn(`Файл не найден: ${file.from}`);
                    }
                });
            }
        }
    ]
});