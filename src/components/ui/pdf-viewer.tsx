import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from './button';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  onDownload?: () => void;
}

export function PDFViewer({ url, onDownload }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {pageNumber} of {numPages || '--'}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || prev))}
          disabled={pageNumber >= (numPages || 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {onDownload && (
          <Button variant="outline" size="icon" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="relative border rounded-lg overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="h-[600px] w-[400px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={600}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}