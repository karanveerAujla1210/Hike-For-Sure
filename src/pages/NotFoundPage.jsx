import { Link } from "react-router-dom";
import { useSeo } from "../hooks/useSeo";

const NotFoundPage = () => {
  useSeo({
    title: "Page Not Found",
    description: "The requested page could not be found."
  });

  return (
    <div className="section-wrap py-24">
      <div className="surface-card mx-auto max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">404</p>
        <h1 className="mt-3 font-heading text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
