import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

function TabPanel(props) {
  const { children, value, index, useMotion = true, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        useMotion ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ p: 3 }}>{children}</Box>
          </motion.div>
        ) : (
          <Box sx={{ p: 3 }}>{children}</Box>
        )
      )}
    </div>
  );
}

export default TabPanel; 