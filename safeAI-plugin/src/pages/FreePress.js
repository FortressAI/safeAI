import React, { useState } from 'react';

const [isPublisher, setIsPublisher] = useState(false);
const [publisherInfo, setPublisherInfo] = useState(null);
const [articles, setArticles] = useState([]);
const [_licenses, setLicenses] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [graphData, setGraphData] = useState({ nodes: [], links: [] });

// Dialog states
const [publishDialogOpen, setPublishDialogOpen] = useState(false);
const [registerDialogOpen, setRegisterDialogOpen] = useState(false); 