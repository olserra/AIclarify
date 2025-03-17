import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { Dashboard } from '@aiclarify/shared-components';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [analysis, setAnalysis] = useState({
        performance: { score: 0, issues: [] },
        security: { score: 0, issues: [] },
        maintainability: { score: 0, issues: [] },
        issues: []
    });

    useEffect(() => {
        socket.on('analysis', (data) => {
            setAnalysis(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <ChakraProvider>
            <Box minH="100vh" bg="gray.50">
                <Dashboard analysis={analysis} />
            </Box>
        </ChakraProvider>
    );
}

export default App; 