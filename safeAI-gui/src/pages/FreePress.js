import React, { useState, useEffect } from 'react';
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
    Alert
} from '@mui/material';
import { ForceGraph2D } from 'react-force-graph';
import FreePressService from '../services/FreePressService';
import IPFSService from '../services/IPFSService';

const FreePress = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isPublisher, setIsPublisher] = useState(false);
    const [publisherInfo, setPublisherInfo] = useState(null);
    const [articles, setArticles] = useState([]);
    const [userLicenses, setUserLicenses] = useState([]);
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

    useEffect(() => {
        initializeServices();
    }, []);

    const initializeServices = async () => {
        try {
            await FreePressService.initialize();
            setIsInitialized(true);
            await loadData();
        } catch (error) {
            console.error('Initialization error:', error);
            setError(error.message);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const account = FreePressService.account;
            
            // Check if user is a publisher
            const publisher = await FreePressService.getPublisherInfo(account);
            setIsPublisher(publisher.isRegistered);
            setPublisherInfo(publisher);
            
            // Load articles and licenses
            if (publisher.isRegistered) {
                const publisherArticles = await FreePressService.getPublisherArticles(account);
                setArticles(publisherArticles);
            }
            
            const licenses = await FreePressService.getUserLicenses(account);
            setUserLicenses(licenses);
            
            // Build graph data
            buildGraphData(publisher.isRegistered ? articles : [], licenses);
            
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const buildGraphData = (articles, licenses) => {
        const nodes = [];
        const links = [];
        const account = FreePressService.account;

        // Add publisher node if registered
        if (isPublisher) {
            nodes.push({
                id: account,
                label: publisherInfo.name,
                type: 'publisher'
            });
        }

        // Add article nodes and links
        articles.forEach(article => {
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
    };

    const handlePublishArticle = async () => {
        try {
            setLoading(true);
            const { title, content, price, tags } = articleForm;
            const tagArray = tags.split(',').map(tag => tag.trim());
            
            const result = await FreePressService.publishArticle(
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

    const handlePurchaseLicense = async (articleId) => {
        try {
            setLoading(true);
            await FreePressService.purchaseLicense(articleId);
            
            setSnackbar({
                open: true,
                message: 'License purchased successfully!',
                severity: 'success'
            });
            
            await loadData();
        } catch (error) {
            console.error('Error purchasing license:', error);
            setSnackbar({
                open: true,
                message: 'Error purchasing license: ' + error.message,
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
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    FreePress - Decentralized News Platform
                </Typography>

                {!isPublisher && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setRegisterDialogOpen(true)}
                        sx={{ mb: 2 }}
                    >
                        Register as Publisher
                    </Button>
                )}

                {isPublisher && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setPublishDialogOpen(true)}
                        sx={{ mb: 2 }}
                    >
                        Publish Article
                    </Button>
                )}

                <Grid container spacing={3}>
                    {/* Knowledge Graph Visualization */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Knowledge Graph
                                </Typography>
                                <Box height="500px">
                                    <ForceGraph2D
                                        graphData={graphData}
                                        nodeLabel="label"
                                        nodeAutoColorBy="type"
                                        linkDirectionalParticles={2}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Articles List */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Your Articles
                                </Typography>
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
                    </Grid>

                    {/* Licenses List */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Your Licenses
                                </Typography>
                                {userLicenses.map((license) => (
                                    <Card key={license.articleId} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">{license.title}</Typography>
                                            <Typography variant="body2">
                                                Publisher: {license.publisher}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

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
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FreePress; 