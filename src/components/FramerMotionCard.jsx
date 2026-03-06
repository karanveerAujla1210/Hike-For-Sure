import { motion } from 'framer-motion';

export default function FramerMotionCard({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
