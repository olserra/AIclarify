import React from 'react';
import {
    Box,
    Grid,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    useColorModeValue,
} from '@chakra-ui/react';
import { PerformanceChart } from './PerformanceChart';
import { SecurityScore } from './SecurityScore';
import { MaintainabilityScore } from './MaintainabilityScore';
import { IssuesList } from './IssuesList';

interface DashboardProps {
    analysis: {
        performance: {
            score: number;
            issues: any[];
        };
        security: {
            score: number;
            issues: any[];
        };
        maintainability: {
            score: number;
            issues: any[];
        };
        issues: any[];
    };
}

export const Dashboard: React.FC<DashboardProps> = ({ analysis }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box p={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg">AIclarify Studio</Heading>
                    <Text color="gray.600">Real-time code analysis dashboard</Text>
                </Box>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <VStack align="stretch" spacing={4}>
                            <Heading size="md">Performance</Heading>
                            <PerformanceChart data={analysis.performance} />
                        </VStack>
                    </Box>

                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <VStack align="stretch" spacing={4}>
                            <Heading size="md">Security</Heading>
                            <SecurityScore data={analysis.security} />
                        </VStack>
                    </Box>

                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <VStack align="stretch" spacing={4}>
                            <Heading size="md">Maintainability</Heading>
                            <MaintainabilityScore data={analysis.maintainability} />
                        </VStack>
                    </Box>
                </Grid>

                <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <VStack align="stretch" spacing={4}>
                        <Heading size="md">Issues</Heading>
                        <IssuesList issues={analysis.issues} />
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}; 