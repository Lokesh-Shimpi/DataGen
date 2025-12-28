/**
 * Error Page
 * ==========
 * Global error boundary page.
 */

import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <AlertTriangle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />Try Again
          </Button>
          <Link to="/"><Button className="gap-2"><Home className="h-4 w-4" />Go Home</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;