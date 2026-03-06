import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ theme, onToggleTheme }) => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-brand/20 blur-3xl dark:bg-brand/25" />
        <div className="absolute right-0 top-64 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-900/30" />
        <div className="absolute bottom-16 left-1/3 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/30" />
      </div>

      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Layout;
