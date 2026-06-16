import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>404 — Page Not Found</title></Helmet>
      <div className="container-custom py-20 text-center">
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-heading font-semibold mb-2">Page Not Found</h2>
        <p className="text-textMuted mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    </>
  );
}
