/**
 * Dashboard Page
 * ==============
 * Main dashboard showing user's datasets and analysis history.
 * All data comes from API calls - no mock data.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  BarChart3, 
  Plus, 
  FileText, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/DataCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard, SkeletonTable } from '@/components/ui/LoadingSkeleton';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import api, { ApiError } from '@/lib/api';
import { Helmet } from 'react-helmet-async';

// Types for API responses
interface DatasetSummary {
  id: string;
  name: string;
  rowCount: number;
  createdAt: string;
}

interface AnalysisSummary {
  id: string;
  name: string;
  chartType: string;
  createdAt: string;
}

interface DashboardStats {
  totalDatasets: number;
  totalAnalyses: number;
  recentActivity: number;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch datasets and analyses in parallel
        const [datasetsRes, analysesRes] = await Promise.all([
          api.get<DatasetSummary[]>('/user/datasets').catch(() => []),
          api.get<AnalysisSummary[]>('/user/analysis').catch(() => []),
        ]);
        
        setDatasets(datasetsRes);
        setAnalyses(analysesRes);
        setStats({
          totalDatasets: datasetsRes.length,
          totalAnalyses: analysesRes.length,
          recentActivity: datasetsRes.length + analysesRes.length,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError('Failed to load dashboard data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <MainLayout showFooter={false}>
      <Helmet>
        <title>Dashboard | Dataset Generator & Analyzer</title>
        <meta name="description" content="View and manage your datasets and analyses from your dashboard." />
      </Helmet>

      <div className="container-wide py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your datasets and analyses from your dashboard.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link to="/generator">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Dataset
            </Button>
          </Link>
          <Link to="/analyzer">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analyze Data
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : stats ? (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Datasets"
              value={stats.totalDatasets}
              icon={<Database className="h-6 w-6 text-primary" />}
            />
            <StatCard
              title="Total Analyses"
              value={stats.totalAnalyses}
              icon={<BarChart3 className="h-6 w-6 text-primary" />}
            />
            <StatCard
              title="Recent Activity"
              value={stats.recentActivity}
              description="Last 30 days"
              icon={<Clock className="h-6 w-6 text-primary" />}
            />
          </div>
        ) : null}

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-foreground">
            {error}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Datasets */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Datasets</CardTitle>
                  <CardDescription>Your generated datasets</CardDescription>
                </div>
                <Link to="/generator">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <SkeletonTable rows={3} columns={3} />
              ) : datasets.length === 0 ? (
                <EmptyState
                  variant="table"
                  title="No datasets yet"
                  description="Generate your first dataset to see it here."
                  action={{
                    label: 'Generate Dataset',
                    onClick: () => window.location.href = '/generator',
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {datasets.slice(0, 5).map((dataset) => (
                    <div 
                      key={dataset.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{dataset.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {dataset.rowCount} rows
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(dataset.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Analyses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Analyses</CardTitle>
                  <CardDescription>Your data visualizations</CardDescription>
                </div>
                <Link to="/analyzer">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <SkeletonTable rows={3} columns={3} />
              ) : analyses.length === 0 ? (
                <EmptyState
                  variant="chart"
                  title="No analyses yet"
                  description="Upload data to create your first visualization."
                  action={{
                    label: 'Analyze Data',
                    onClick: () => window.location.href = '/analyzer',
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {analyses.slice(0, 5).map((analysis) => (
                    <div 
                      key={analysis.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{analysis.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {analysis.chartType}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;