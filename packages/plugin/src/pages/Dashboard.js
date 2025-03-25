import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  SmartToy as SmartToyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Dashboard as DashboardIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

const recentActivity = [
  {
    id: 1,
    type: 'success',
    message: 'New theorem proved in Mathematics KG',
    time: '5 minutes ago',
    icon: <CheckCircleIcon />,
  },
  {
    id: 2,
    type: 'warning',
    message: 'Security scan completed - 2 vulnerabilities found',
    time: '1 hour ago',
    icon: <WarningIcon />,
  },
  {
    id: 3,
    type: 'info',
    message: 'New agent deployed: Ethics Analyzer v2.0',
    time: '2 hours ago',
    icon: <InfoIcon />,
  },
];

// Security checks data
const securityChecks = [
  { title: 'Threat Detection', status: 'Active', icon: <ShieldIcon sx={{ color: '#4CAF50' }} /> },
  { title: 'Vulnerabilities', status: '2 Found', icon: <WarningIcon sx={{ color: '#FF9800' }} /> },
  { title: 'Compliance', status: '98% Complete', icon: <CheckCircleIcon sx={{ color: '#2196F3' }} /> },
];

const StatusIcon = ({ status }) => {
} 