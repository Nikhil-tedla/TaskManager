import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./src/setupTests.js'],
        include: ['src/**/*.test.js'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'src/setupTests.js']
        },
        mockReset: true,
        restoreMocks: true,
        clearMocks: true,
        testTimeout: 30000, // Increase timeout to 30 seconds
        isolate: true, // Run tests in isolation
        pool: 'forks', // Use fork pool for better isolation
    },
});
