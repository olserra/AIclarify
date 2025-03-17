import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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