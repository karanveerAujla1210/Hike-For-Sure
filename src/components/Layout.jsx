import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ theme, onToggleTheme }) => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-40 dark:opacity-20">
          <div className="grid-overlay h-full w-full" />
        </div>
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl dark:bg-brand/25" />
        <div className="absolute right-[-4rem] top-56 h-96 w-96 rounded-full bg-violet-300/35 blur-3xl dark:bg-violet-900/35" />
        <div className="absolute bottom-8 left-1/3 h-80 w-80 rounded-full bg-indigo-200/45 blur-3xl dark:bg-indigo-900/30" />
      </div>

      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="pt-28"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Layout;
