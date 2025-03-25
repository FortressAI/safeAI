import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { MenuBook as DocsIcon, Storage as Neo4jIcon } from '@mui/icons-material';
import config from '../config';

const ExternalLinks = () => {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
      <Tooltip title="Open Documentation">
        <IconButton
          color="inherit"
          onClick={() => openInNewTab(config.docsUrl)}
          aria-label="Open Documentation"
        >
          <DocsIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Open Neo4j Browser">
        <IconButton
          color="inherit"
          onClick={() => openInNewTab(config.neo4jBrowserUrl)}
          aria-label="Open Neo4j Browser"
        >
          <Neo4jIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ExternalLinks; 