import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Help as HelpIcon
} from '@mui/icons-material';

const statusColors = {
    EXCELLENT: '#4caf50',
    GOOD: '#8bc34a',
    ACCEPTABLE: '#ffeb3b',
    NEEDS_IMPROVEMENT: '#ff9800',
    FAILED: '#f44336'
};

const statusIcons = {
    EXCELLENT: <CheckCircleIcon style={{ color: statusColors.EXCELLENT }} />,
    GOOD: <CheckCircleIcon style={{ color: statusColors.GOOD }} />,
    ACCEPTABLE: <WarningIcon style={{ color: statusColors.ACCEPTABLE }} />,
    NEEDS_IMPROVEMENT: <WarningIcon style={{ color: statusColors.NEEDS_IMPROVEMENT }} />,
    FAILED: <ErrorIcon style={{ color: statusColors.FAILED }} />
};

const EthicalAuditResults = ({ auditResults }) => {
    if (!auditResults) {
        return (
            <Alert severity="info">
                No audit results available. Run an ethical audit to see the results.
            </Alert>
        );
    }

    const {
        agentId,
        timestamp,
        evaluations,
        overallScore,
        status,
        recommendations,
        failurePoints
    } = auditResults;

    return (
        <Box>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        {/* Header */}
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" gutterBottom>
                                    Ethical Audit Results
                                </Typography>
                                <Tooltip title={`Last updated: ${new Date(timestamp).toLocaleString()}`}>
                                    <IconButton>
                                        <InfoIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography variant="subtitle1" color="textSecondary">
                                Agent: {agentId}
                            </Typography>
                        </Grid>

                        {/* Overall Score */}
                        <Grid item xs={12}>
                            <Box mb={2}>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Typography variant="h6">
                                        Overall Score: {Math.round(overallScore * 100)}%
                                    </Typography>
                                    <Box ml={1}>
                                        {statusIcons[status]}
                                    </Box>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={overallScore * 100}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: statusColors[status]
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Category Evaluations */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Category Evaluations
                            </Typography>
                            <Grid container spacing={2}>
                                {evaluations.map((evaluation, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {evaluation.category}
                                                </Typography>
                                                <Box display="flex" alignItems="center">
                                                    <Box flexGrow={1} mr={1}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={evaluation.score * 100}
                                                            sx={{
                                                                height: 8,
                                                                borderRadius: 4
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2">
                                                        {Math.round(evaluation.score * 100)}%
                                                    </Typography>
                                                </Box>
                                                <List dense>
                                                    {evaluation.findings.map((finding, idx) => (
                                                        <ListItem key={idx}>
                                                            <ListItemText
                                                                primary={finding}
                                                                primaryTypographyProps={{
                                                                    variant: 'body2',
                                                                    color: 'textSecondary'
                                                                }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {/* Failure Points */}
                        {failurePoints.length > 0 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Critical Issues
                                </Typography>
                                <Alert severity="error">
                                    <List dense>
                                        {failurePoints.map((point, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={`${point.category}: Score ${Math.round(point.score * 100)}%`}
                                                    secondary={point.findings.join(', ')}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Alert>
                            </Grid>
                        )}

                        {/* Recommendations */}
                        {recommendations.length > 0 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Recommendations
                                </Typography>
                                <List>
                                    {recommendations.map((rec, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={rec.category}
                                                    secondary={rec.recommendation}
                                                />
                                            </ListItem>
                                            {index < recommendations.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EthicalAuditResults; 