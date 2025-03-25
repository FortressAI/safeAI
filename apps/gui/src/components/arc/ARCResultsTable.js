import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Button,
  alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Results table for displaying ARC prize data
 */
const ARCResultsTable = ({ data = [], columns, onSelectPuzzle }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // If no column definitions provided, use default columns based on data structure
  const defaultColumns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status' },
    { id: 'score', label: 'Score' },
    { id: 'accuracy', label: 'Accuracy (%)' },
    { id: 'duration', label: 'Time (s)' },
    { id: 'actions', label: 'Actions' },
  ];

  const tableColumns = columns || defaultColumns;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.common.black, 0.05) }}>
        <Typography color="text.secondary">
          No results available
        </Typography>
      </Paper>
    );
  }

  // Render cell content based on column type and value
  const renderCell = (column, row) => {
    const value = row[column.id];

    // Handle actions column
    if (column.id === 'actions') {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => onSelectPuzzle && onSelectPuzzle(row)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }

    // Handle status column
    if (column.id === 'status') {
      return (
        <Chip 
          size="small"
          label={value}
          color={value === 'completed' ? 'success' : value === 'failed' ? 'error' : 'default'}
          icon={value === 'completed' ? <CheckCircleIcon /> : value === 'failed' ? <ErrorIcon /> : <InfoIcon />}
        />
      );
    }

    // Handle boolean values
    if (column.type === 'boolean') {
      return value ? 
        <CheckCircleIcon fontSize="small" color="success" /> : 
        <ErrorIcon fontSize="small" color="error" />;
    }

    // Handle score or accuracy values
    if (['score', 'accuracy'].includes(column.id) && typeof value === 'number') {
      return `${value}%`;
    }

    // Handle time/duration values
    if (column.id === 'duration' && typeof value === 'number') {
      return `${value.toFixed(2)}s`;
    }

    // Default rendering
    return value || '-';
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {tableColumns.map(column => (
                <TableCell 
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    fontWeight: 500
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow 
                  key={row.id || index}
                  hover
                  sx={{ 
                    cursor: onSelectPuzzle ? 'pointer' : 'default',
                    '&:nth-of-type(odd)': {
                      bgcolor: alpha(theme.palette.common.black, 0.02),
                    },
                  }}
                  onClick={() => onSelectPuzzle && onSelectPuzzle(row)}
                >
                  {tableColumns.map(column => (
                    <TableCell 
                      key={column.id} 
                      align={column.align || 'left'}
                    >
                      {renderCell(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

ARCResultsTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.string,
      type: PropTypes.string
    })
  ),
  onSelectPuzzle: PropTypes.func
};

export default ARCResultsTable; 