import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    useTheme,
    alpha,
    IconButton,
    Tooltip,
    Divider
} from '@mui/material';
import {
    Person as PersonIcon,
    CloudUpload as CloudUploadIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { ForceGraph2D } from 'react-force-graph';
import FreePressService from '../services/FreePressService';
import { motion, AnimatePresence } from 'framer-motion';

const FreePress = () => {
    const theme = useTheme();
    const [isInitialized, setIsInitialized] = useState(false);
    const [isPublisher, setIsPublisher] = useState(false);
    const [publisherInfo, setPublisherInfo] = useState(null);
    const [articles, setArticles] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    
    // Dialog states
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
    
    // Form states
    const [articleForm, setArticleForm] = useState({
        title: '',
        content: '',
        price: '',
        tags: ''
    });
    const [publisherName, setPublisherName] = useState('');
    
    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const buildGraphData = useCallback((currentArticles, licenses) => {
        const nodes = [];
        const links = [];
        const account = FreePressService.account;

        // Add publisher node if registered
        if (isPublisher && publisherInfo) {
            nodes.push({
                id: account,
                label: publisherInfo.name,
                type: 'publisher'
            });
        }

        // Add article nodes and links
        currentArticles.forEach(article => {
            nodes.push({
                id: article.articleId,
                label: article.title,
                type: 'article'
            });
            links.push({
                source: account,
                target: article.articleId,
                type: 'published'
            });
        });

        // Add license links
        licenses.forEach(license => {
            if (!nodes.some(n => n.id === license.articleId)) {
                nodes.push({
                    id: license.articleId,
                    label: license.title,
                    type: 'article'
                });
            }
            links.push({
                source: account,
                target: license.articleId,
                type: 'licensed'
            });
        });

        setGraphData({ nodes, links });
    }, [isPublisher, publisherInfo]);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const account = FreePressService.account;
            
            // Check if user is a publisher
            const publisher = await FreePressService.getPublisherInfo(account);
            setIsPublisher(publisher.isRegistered);
            setPublisherInfo(publisher);
            
            // Load articles and licenses
            let publisherArticles = [];
            if (publisher.isRegistered) {
                publisherArticles = await FreePressService.getPublisherArticles(account);
                setArticles(publisherArticles);
            }
            
            const userLicenses = await FreePressService.getUserLicenses(account);
            setLicenses(userLicenses);
            
            // Build graph data
            buildGraphData(publisherArticles, userLicenses);
            
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setError(error.message);
            setLoading(false);
        }
    }, [buildGraphData]);

    const initializeServices = useCallback(async () => {
        try {
            await FreePressService.initialize();
            setIsInitialized(true);
            await loadData();
        } catch (error) {
            console.error('Initialization error:', error);
            setError(error.message);
        }
    }, [loadData]);

    useEffect(() => {
        initializeServices();
    }, [initializeServices]);

    const handlePublishArticle = async () => {
        try {
            setLoading(true);
            const { title, content, price, tags } = articleForm;
            const tagArray = tags.split(',').map(tag => tag.trim());
            
            await FreePressService.publishArticle(
                content,
                parseFloat(price),
                title,
                tagArray
            );
            
            setSnackbar({
                open: true,
                message: 'Article published successfully!',
                severity: 'success'
            });
            
            setPublishDialogOpen(false);
            setArticleForm({ title: '', content: '', price: '', tags: '' });
            await loadData();
        } catch (error) {
            console.error('Error publishing article:', error);
            setSnackbar({
                open: true,
                message: 'Error publishing article: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterPublisher = async () => {
        try {
            setLoading(true);
            await FreePressService.registerPublisher(publisherName);
            
            setSnackbar({
                open: true,
                message: 'Successfully registered as publisher!',
                severity: 'success'
            });
            
            setRegisterDialogOpen(false);
            setPublisherName('');
            await loadData();
        } catch (error) {
            console.error('Error registering publisher:', error);
            setSnackbar({
                open: true,
                message: 'Error registering publisher: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isInitialized) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <Typography variant="h6">
                        Please connect your Web3 wallet to use FreePress
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <Typography color="error" variant="h6">
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container maxWidth="xl" sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Decentralized Free Press
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Publish and access censorship-resistant articles
                        </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                        {isInitialized && (
                            <>
                                <Tooltip title="Refresh data">
                                    <IconButton onClick={loadData}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                {isPublisher ? (
                                    <Button
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        onClick={() => setPublishDialogOpen(true)}
                                        sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                            },
                                        }}
                                    >
                                        Publish Article
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={<PersonIcon />}
                                        onClick={() => setRegisterDialogOpen(true)}
                                        sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                            },
                                        }}
                                    >
                                        Register as Publisher
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </Box>

                {loading && (
                    <Box display="flex" flexDirection="column" alignItems="center" my={8}>
                        <CircularProgress size={60} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Loading Free Press data...
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <AnimatePresence mode="wait">
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={8}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        sx={{
                                            height: '600px',
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                                            backdropFilter: 'blur(10px)',
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Article Network Graph
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Box sx={{ height: 500 }}>
                                                <ForceGraph2D
                                                    graphData={graphData}
                                                    nodeLabel="label"
                                                    nodeAutoColorBy="type"
                                                    linkDirectionalParticles={2}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            <Grid item xs={12} lg={4}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                                            backdropFilter: 'blur(10px)',
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Latest Articles
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            {articles.map((article) => (
                                                <Card key={article.articleId} sx={{ mb: 2 }}>
                                                    <CardContent>
                                                        <Typography variant="h6">{article.title}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Price: {FreePressService.weiToEther(article.price)} ETH
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Tags: {article.tags.join(', ')}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </AnimatePresence>
                )}

                {/* Publish Article Dialog */}
                <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)}>
                    <DialogTitle>Publish Article</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Title"
                            fullWidth
                            value={articleForm.title}
                            onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Content"
                            fullWidth
                            multiline
                            rows={4}
                            value={articleForm.content}
                            onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Price (ETH)"
                            fullWidth
                            type="number"
                            value={articleForm.price}
                            onChange={(e) => setArticleForm({ ...articleForm, price: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Tags (comma-separated)"
                            fullWidth
                            value={articleForm.tags}
                            onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePublishArticle} color="primary">
                            Publish
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Register Publisher Dialog */}
                <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)}>
                    <DialogTitle>Register as Publisher</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Publisher Name"
                            fullWidth
                            value={publisherName}
                            onChange={(e) => setPublisherName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRegisterDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRegisterPublisher} color="primary">
                            Register
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </motion.div>
    );
};

export default FreePress; 