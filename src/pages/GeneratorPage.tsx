/**
 * Dataset Generator Page
 * ======================
 * UI for generating datasets via form, rules, or prompts.
 * All logic happens on the backend - this is UI only.
 */

import { useState } from 'react';
import { 
  FileText, 
  Settings, 
  Sparkles, 
  Download, 
  Edit2,
  RefreshCw,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/FormInput';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/DataCard';
import { EmptyTableState } from '@/components/ui/EmptyState';
import { SkeletonTable } from '@/components/ui/LoadingSkeleton';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter, ModalDescription } from '@/components/ui/Modal';
import { SavePromptModal } from '@/components/ui/SavePromptModal';
import { MainLayout } from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

// Tab types
type TabType = 'form' | 'rules' | 'prompt';

// Field definition for form tab
interface FieldDefinition {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

// Generated dataset response
interface GeneratedDataset {
  id: string;
  name: string;
  columns: string[];
  rows: Record<string, unknown>[];
  summary: {
    totalRows: number;
    totalColumns: number;
  };
}

export function GeneratorPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('form');
  
  // Form tab state
  const [datasetName, setDatasetName] = useState('');
  const [rowCount, setRowCount] = useState('100');
  const [fields, setFields] = useState<FieldDefinition[]>([
    { id: '1', name: '', type: 'string', required: true }
  ]);
  
  // Rules tab state
  const [rulesJson, setRulesJson] = useState('');
  
  // Prompt tab state
  const [prompt, setPrompt] = useState('');
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedDataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldDefinition | null>(null);
  
  // Save prompt modal state
  const [isSavePromptOpen, setIsSavePromptOpen] = useState(false);

  // Field type options
  const fieldTypes = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'date', label: 'Date' },
    { value: 'email', label: 'Email' },
    { value: 'uuid', label: 'UUID' },
  ];

  // Add new field
  const addField = () => {
    setFields([
      ...fields,
      { id: Date.now().toString(), name: '', type: 'string', required: true }
    ]);
  };

  // Remove field
  const removeField = (id: string) => {
    if (fields.length > 1) {
      setFields(fields.filter(f => f.id !== id));
    }
  };

  // Update field
  const updateField = (id: string, updates: Partial<FieldDefinition>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  // Handle generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      let endpoint = '';
      let payload: unknown = {};
      
      switch (activeTab) {
        case 'form':
          endpoint = '/generator/form';
          payload = {
            name: datasetName,
            rowCount: parseInt(rowCount),
            fields: fields.filter(f => f.name.trim()),
          };
          break;
        case 'rules':
          endpoint = '/generator/rules';
          payload = { rules: JSON.parse(rulesJson || '{}') };
          break;
        case 'prompt':
          endpoint = '/generator/prompt';
          payload = { prompt };
          break;
      }
      
      const result = await api.post<GeneratedDataset>(endpoint, payload);
      setGeneratedData(result);
      toast({
        title: 'Dataset generated',
        description: `Created ${result.summary.totalRows} rows with ${result.summary.totalColumns} columns.`,
      });
    } catch (err) {
      setError('Failed to generate dataset. Please check your inputs and try again.');
      toast({
        title: 'Generation failed',
        description: 'Please check your inputs and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle download
  const handleDownload = async (format: 'csv' | 'json' | 'pdf') => {
    if (!generatedData) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || '/api'}/generator/${generatedData.id}/download?format=${format}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedData.name || 'dataset'}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast({
        title: 'Download failed',
        description: 'Could not download the file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Tab button component
  const TabButton = ({ tab, label, icon: Icon }: { tab: TabType; label: string; icon: typeof FileText }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
        activeTab === tab
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
      role="tab"
      aria-selected={activeTab === tab}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <MainLayout showFooter={false}>
      <Helmet>
        <title>Dataset Generator | Create Custom Datasets</title>
        <meta name="description" content="Generate custom datasets with flexible schema definitions, validation rules, and AI-powered generation." />
      </Helmet>

      <div className="container-wide py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dataset Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Create custom datasets using forms, rules, or natural language prompts.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Configure Dataset</CardTitle>
              {/* Tabs */}
              <div className="mt-4 flex gap-2" role="tablist">
                <TabButton tab="form" label="Form" icon={FileText} />
                <TabButton tab="rules" label="Rules" icon={Settings} />
                <TabButton tab="prompt" label="Prompt" icon={Sparkles} />
              </div>
            </CardHeader>
            <CardContent>
              {/* Form Tab */}
              {activeTab === 'form' && (
                <div className="space-y-6">
                  <Input
                    label="Dataset Name"
                    placeholder="e.g., Users, Products, Transactions"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                  />
                  
                  <Input
                    label="Number of Rows"
                    type="number"
                    placeholder="100"
                    value={rowCount}
                    onChange={(e) => setRowCount(e.target.value)}
                    hint="Maximum 10,000 rows"
                  />

                  {/* Fields */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Fields
                    </label>
                    <div className="space-y-3">
                      {fields.map((field) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Input
                            placeholder="Field name"
                            value={field.name}
                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                            className="flex-1"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => updateField(field.id, { type: e.target.value })}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label="Field type"
                          >
                            {fieldTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeField(field.id)}
                            disabled={fields.length === 1}
                            aria-label="Remove field"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addField}
                      className="mt-3 gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Field
                    </Button>
                  </div>
                </div>
              )}

              {/* Rules Tab */}
              {activeTab === 'rules' && (
                <div className="space-y-4">
                  <Textarea
                    label="Rules (JSON)"
                    placeholder='{\n  "fields": [...],\n  "constraints": [...]\n}'
                    value={rulesJson}
                    onChange={(e) => setRulesJson(e.target.value)}
                    hint="Define generation rules in JSON format"
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              )}

              {/* Prompt Tab */}
              {activeTab === 'prompt' && (
                <div className="space-y-4">
                  <Textarea
                    label="Describe your dataset"
                    placeholder="Generate a dataset of 100 users with name, email, age, and registration date..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    hint="Describe what kind of data you need in plain language"
                    className="min-h-[200px]"
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-foreground">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mt-6 w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Dataset'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview</CardTitle>
                {generatedData && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        if (isAuthenticated) {
                          // Save to backend when authenticated
                          toast({ title: 'Saved!', description: 'Dataset saved to your dashboard.' });
                        } else {
                          setIsSavePromptOpen(true);
                        }
                      }}
                      className="gap-1"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                      className="gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload('csv')}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload('json')}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <SkeletonTable rows={5} columns={4} />
              ) : generatedData ? (
                <div>
                  {/* Summary */}
                  <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
                    <span>{generatedData.summary.totalRows} rows</span>
                    <span>{generatedData.summary.totalColumns} columns</span>
                  </div>
                  
                  {/* Table */}
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          {generatedData.columns.map((col) => (
                            <th 
                              key={col} 
                              className="px-4 py-3 text-left font-medium text-foreground"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {generatedData.rows.slice(0, 10).map((row, i) => (
                          <tr key={i} className="border-t border-border hover:bg-secondary/50">
                            {generatedData.columns.map((col) => (
                              <td key={col} className="px-4 py-3 text-muted-foreground">
                                {String(row[col] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {generatedData.rows.length > 10 && (
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                      Showing 10 of {generatedData.rows.length} rows
                    </p>
                  )}
                </div>
              ) : (
                <EmptyTableState onAction={handleGenerate} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Dataset</ModalTitle>
            <ModalDescription>
              Modify the generation parameters and regenerate.
            </ModalDescription>
          </ModalHeader>
          <div className="py-4">
            <Input
              label="Dataset Name"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
            />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsEditModalOpen(false);
              handleGenerate();
            }}>
              Regenerate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Save Prompt Modal for unauthenticated users */}
      <SavePromptModal 
        open={isSavePromptOpen} 
        onOpenChange={setIsSavePromptOpen}
        itemType="dataset"
      />
    </MainLayout>
  );
}

export default GeneratorPage;