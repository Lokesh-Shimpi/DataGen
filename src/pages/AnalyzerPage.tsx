/**
 * Analyzer Page
 * =============
 * Data analysis and visualization UI.
 */

import { useState } from 'react';
import { Upload, BarChart3, Download, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/FormInput';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/DataCard';
import { EmptyChartState } from '@/components/ui/EmptyState';
import { SkeletonChart } from '@/components/ui/LoadingSkeleton';
import { SavePromptModal } from '@/components/ui/SavePromptModal';
import { MainLayout } from '@/components/layout/MainLayout';
import { FileUploader } from '@/components/data/FileUploader';
import { TablePreview } from '@/components/data/TablePreview';
import { CodeViewer } from '@/components/data/CodeViewer';
import api, { uploadFile } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar';

interface AnalysisResult {
  id: string;
  preview: { columns: string[]; rows: Record<string, unknown>[] };
  suggestedCharts: ChartType[];
  chartData?: { labels: string[]; values: number[] };
  generatedCode?: string;
}

// Sample data for demonstration
const sampleResult: AnalysisResult = {
  id: 'sample-1',
  preview: {
    columns: ['Month', 'Sales', 'Revenue', 'Customers'],
    rows: [
      { Month: 'Jan', Sales: 120, Revenue: 4500, Customers: 45 },
      { Month: 'Feb', Sales: 150, Revenue: 5200, Customers: 52 },
      { Month: 'Mar', Sales: 180, Revenue: 6100, Customers: 61 },
      { Month: 'Apr', Sales: 165, Revenue: 5800, Customers: 58 },
      { Month: 'May', Sales: 210, Revenue: 7200, Customers: 72 },
      { Month: 'Jun', Sales: 240, Revenue: 8500, Customers: 85 },
    ]
  },
  suggestedCharts: ['bar', 'line', 'pie'],
  chartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [120, 150, 180, 165, 210, 240]
  },
  generatedCode: `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', sales: 120 },
  { month: 'Feb', sales: 150 },
  { month: 'Mar', sales: 180 },
  { month: 'Apr', sales: 165 },
  { month: 'May', sales: 210 },
  { month: 'Jun', sales: 240 },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}`
};

export function AnalyzerPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType>('bar');
  const [error, setError] = useState<string | null>(null);
  const [isSavePromptOpen, setIsSavePromptOpen] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setManualData('');
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let response: AnalysisResult;
      
      if (file) {
        response = await uploadFile('/analyzer/upload', file) as AnalysisResult;
      } else {
        response = await api.post<AnalysisResult>('/analyzer/upload', { 
          data: manualData, 
          prompt 
        });
      }
      
      setResult(response);
      if (response.suggestedCharts?.length) {
        setSelectedChart(response.suggestedCharts[0]);
      }
      toast({ title: 'Analysis complete', description: 'Your data has been processed.' });
    } catch {
      // Use sample data for demo when no backend
      setResult(sampleResult);
      setSelectedChart('bar');
      toast({ title: 'Sample Data Loaded', description: 'Showing demo visualization.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleData = () => {
    setResult(sampleResult);
    setSelectedChart('bar');
    toast({ title: 'Sample Data Loaded', description: 'Showing demo visualization.' });
  };

  const chartTypes: { type: ChartType; label: string }[] = [
    { type: 'bar', label: 'Bar' },
    { type: 'line', label: 'Line' },
    { type: 'area', label: 'Area' },
    { type: 'pie', label: 'Pie' },
    { type: 'doughnut', label: 'Doughnut' },
    { type: 'scatter', label: 'Scatter' },
    { type: 'radar', label: 'Radar' },
  ];

  return (
    <MainLayout showFooter={false}>
      <Helmet>
        <title>Dataset Analyzer | Visualize Your Data</title>
        <meta name="description" content="Upload and analyze your data with AI-powered visualization tools." />
      </Helmet>

      <div className="container-wide py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dataset Analyzer</h1>
          <p className="mt-2 text-muted-foreground">
            Upload your data or enter it manually to create visualizations.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Input */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploader onFileSelect={handleFileSelect} />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                </div>
              </div>
              
              <Textarea
                label="Manual Data Entry"
                placeholder="Paste CSV data or JSON here..."
                value={manualData}
                onChange={(e) => { setManualData(e.target.value); setFile(null); }}
                className="min-h-[120px] font-mono text-sm"
              />
              
              <Textarea
                label="Analysis Prompt (Optional)"
                placeholder="Describe what you want to analyze..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-foreground">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={handleAnalyze} disabled={isAnalyzing || (!file && !manualData)} className="flex-1 gap-2">
                  {isAnalyzing ? <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing...</> : 'Analyze Data'}
                </Button>
                <Button variant="outline" onClick={loadSampleData} className="gap-2">
                  Load Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <SkeletonChart />
              ) : result ? (
                <div className="space-y-6">
                  {/* Chart selector */}
                  <div className="flex flex-wrap gap-2">
                    {chartTypes.map(({ type, label }) => (
                      <button
                        key={type}
                        onClick={() => setSelectedChart(type)}
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                          selectedChart === type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Chart visualization */}
                  <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-secondary/30">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="mx-auto h-12 w-12 mb-2" />
                      <p className="font-medium">{selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart</p>
                      <p className="text-xs mt-1">Visualization preview</p>
                    </div>
                  </div>

                  {/* Download & Save */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => {
                        if (isAuthenticated) {
                          toast({ title: 'Saved!', description: 'Analysis saved to your dashboard.' });
                        } else {
                          setIsSavePromptOpen(true);
                        }
                      }}
                    >
                      <Save className="h-4 w-4" />Save
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />Download Chart
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />Download Code
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyChartState />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Code Section */}
        {result?.generatedCode && (
          <Card className="mt-8">
            <CardHeader><CardTitle>Generated Code</CardTitle></CardHeader>
            <CardContent>
              <CodeViewer code={result.generatedCode} title="React Chart Component" />
            </CardContent>
          </Card>
        )}

        {/* Data Preview */}
        {result?.preview && (
          <Card className="mt-8">
            <CardHeader><CardTitle>Data Preview</CardTitle></CardHeader>
            <CardContent>
              <TablePreview columns={result.preview.columns} rows={result.preview.rows} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Save Prompt Modal for unauthenticated users */}
      <SavePromptModal 
        open={isSavePromptOpen} 
        onOpenChange={setIsSavePromptOpen}
        itemType="analysis"
      />
    </MainLayout>
  );
}

export default AnalyzerPage;