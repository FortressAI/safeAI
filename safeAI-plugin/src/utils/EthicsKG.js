const MetricCard = ({ title, value, icon, color, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 2,
          boxShadow: `0 4px 20px ${alpha(color, 0.1)}`,
          '&:hover': {
            boxShadow: `0 8px 30px ${alpha(color, 0.2)}`,
          },
        }}
      >
        // ... existing code ...
      </Card>
    </motion.div>
  );
}; 