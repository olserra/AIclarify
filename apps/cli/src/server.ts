import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as path from 'path';

export async function createServer(port: number) {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // Enable CORS
    app.use(cors());

    // In development, proxy to the React dev server
    if (process.env.NODE_ENV === 'development') {
        const { createProxyMiddleware } = require('http-proxy-middleware');
        app.use('/', createProxyMiddleware({
            target: 'http://localhost:3000',
            changeOrigin: true,
            ws: true
        }));
    } else {
        // In production, serve the built React app
        app.use(express.static(path.join(__dirname, '../../cli-dashboard/build')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../cli-dashboard/build/index.html'));
        });
    }

    // API endpoints
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    // Socket.IO connection handling
    io.on('connection', (socket) => {
        console.log('📱 Client connected');

        socket.on('disconnect', () => {
            console.log('📱 Client disconnected');
        });
    });

    // Start the server
    await new Promise<void>((resolve) => {
        httpServer.listen(port, () => {
            console.log(`🌐 Server running on port ${port}`);
            resolve();
        });
    });

    return { app, io };
} 