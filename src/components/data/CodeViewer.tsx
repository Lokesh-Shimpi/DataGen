/**
 * CodeViewer Component
 * ====================
 * Read-only code viewer with copy functionality.
 */

import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeViewerProps {
  code: string;
  language?: string;
  title?: string;
  onDownload?: () => void;
  className?: string;
}

export function CodeViewer({
  code,
  language = 'javascript',
  title,
  onDownload,
  className,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn('rounded-lg border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-2">
        <span className="text-sm font-medium text-foreground">
          {title || language}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="gap-1 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="gap-1 text-xs"
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
          )}
        </div>
      </div>
      
      {/* Code content */}
      <div className="max-h-96 overflow-auto bg-background p-4">
        <pre className="text-sm text-foreground">
          <code className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeViewer;