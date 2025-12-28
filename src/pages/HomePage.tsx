/**
 * Home Page (Landing Page)
 * ========================
 * Production-level landing page with:
 * - Hero section
 * - Features section
 * - How it works section
 * - Trust/Benefits section
 * - Footer
 */

import { Link } from 'react-router-dom';
import { 
  Database, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet-async';

// Feature data
const features = [
  {
    icon: Database,
    title: 'Dataset Generator',
    description: 'Create custom datasets with flexible schema definitions, validation rules, and AI-powered generation.',
  },
  {
    icon: BarChart3,
    title: 'Dataset Analyzer',
    description: 'Upload your data and get instant visualizations, insights, and exportable chart components.',
  },
  {
    icon: Sparkles,
    title: 'AI Prompt Support',
    description: 'Describe what you need in plain language and let AI generate or analyze your data automatically.',
  },
];

// How it works steps
const steps = [
  {
    step: '01',
    title: 'Define Your Data',
    description: 'Use our form builder, rule engine, or natural language prompts to specify your dataset requirements.',
  },
  {
    step: '02',
    title: 'Generate or Upload',
    description: 'Create new datasets instantly or upload existing files (CSV, PDF) for analysis.',
  },
  {
    step: '03',
    title: 'Visualize & Export',
    description: 'Get beautiful charts, summary statistics, and download your data in multiple formats.',
  },
];

// Benefits
const benefits = [
  { icon: Zap, title: 'Fast Generation', description: 'Generate thousands of records in seconds' },
  { icon: Shield, title: 'Secure', description: 'Your data stays private and encrypted' },
  { icon: Clock, title: 'Time-Saving', description: 'Automate repetitive data tasks' },
  { icon: CheckCircle2, title: 'Accurate', description: 'High-quality, validated output' },
];

export function HomePage() {
  return (
    <MainLayout>
      <Helmet>
        <title>Dataset Generator & Analyzer | Generate, Analyze & Visualize Data Instantly</title>
        <meta 
          name="description" 
          content="Create custom datasets, analyze your data with AI-powered tools, and generate beautiful visualizations. The complete data toolkit for developers and analysts." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in">
              Generate, Analyze & Visualize Data{' '}
              <span className="text-primary">Instantly</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              The complete data toolkit for developers and analysts. 
              Create custom datasets, run powerful analyses, and export 
              beautiful visualizations — all in one platform.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button size="lg" className="gap-2 px-8">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-8">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Abstract UI Mock */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="mx-auto max-w-4xl rounded-xl border border-border bg-secondary/30 p-4 shadow-large">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-background p-4 shadow-soft">
                  <div className="h-3 w-20 rounded bg-primary/20" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded bg-secondary" />
                    <div className="h-2 w-3/4 rounded bg-secondary" />
                  </div>
                </div>
                <div className="rounded-lg bg-background p-4 shadow-soft">
                  <div className="h-3 w-16 rounded bg-primary/20" />
                  <div className="mt-3 flex items-end gap-1 h-16">
                    {[40, 65, 45, 80, 55].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 rounded-t bg-primary/30" 
                        style={{ height: `${h}%` }} 
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-background p-4 shadow-soft">
                  <div className="h-3 w-24 rounded bg-primary/20" />
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="h-2 flex-1 rounded bg-secondary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      <div className="h-2 flex-1 rounded bg-secondary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-secondary/20 py-20" aria-labelledby="features-heading">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="features-heading" className="text-3xl font-bold text-foreground">
              Everything you need for data work
            </h2>
            <p className="mt-4 text-muted-foreground">
              Powerful tools designed to streamline your data generation and analysis workflow.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article 
                key={feature.title}
                className="group rounded-xl border border-border bg-background p-6 transition-all hover:shadow-medium hover:border-primary/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </MainLayout>
  );
}

export default HomePage;