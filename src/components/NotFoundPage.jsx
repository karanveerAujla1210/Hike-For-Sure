import BrandLogo from './BrandLogo';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-gradient text-white">
      <BrandLogo className="w-24 mb-6" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="bg-white text-brand rounded-xl px-6 py-3 font-semibold shadow-glow hover:bg-brand hover:text-white transition-all">Go Home</Link>
    </div>
  );
}
