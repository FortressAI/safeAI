/**
 * ErrorFallback component for error boundary
 * @param {object} props - Component props
 * @returns {JSX.Element} ErrorFallback component
 */
error: PropTypes.shape({
  message: PropTypes.string.isRequired,
}).isRequired,
resetErrorBoundary: PropTypes.func.isRequired
};

/**
 * CapabilityCard component for displaying agent capabilities 