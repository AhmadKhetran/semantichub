"use client";

import {
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3,
  Hash,
  Type,
  Eye,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Connection } from "./types";

interface DatasetProfile {
  id: string;
  name: string;
  source: "Local" | "S3" | "Database";
  rows: number;
  columns: number;
  lastProfiled: string;
  summary: {
    totalRows: number;
    totalColumns: number;
    missingValues: number;
    missingPercentage: number;
    duplicatedRows: number;
    duplicatedPercentage: number;
    columnsWithMissing: number;
    constantColumns: number;
    numericColumns: number;
    categoricalColumns: number;
    datetimeColumns: number;
    textColumns: number;
  };
  quality: {
    passedExpectations: number;
    warnings: number;
    criticalIssues: number;
  };
}

interface pageProps {
  connections: Connection[];
  selectedCatalogue?: string | null;
  changeCatalogue: (id: string) => void;
  catalogueDetails: any;
}

export default function ProfilingPage({
  connections,
  selectedCatalogue,
  changeCatalogue,
  catalogueDetails,
}: pageProps) {
  console.log("catalogue details", catalogueDetails);
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Local":
        return <FileText className="h-4 w-4" />;
      case "S3":
        return <Database className="h-4 w-4" />;
      case "Database":
        return <Database className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getQualityColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getQualityBadgeVariant = (issues: number) => {
    if (issues === 0) return "default";
    if (issues <= 3) return "secondary";
    return "destructive";
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const handleInputChange = async (value: string) => {
    changeCatalogue(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dataset Profiling</h1>
          <p className="mt-1 text-gray-600">Data quality and profiling reports</p>
        </div>
        <Select value={selectedCatalogue || ""} onValueChange={(value) => handleInputChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Catalogue" />
          </SelectTrigger>
          <SelectContent>
            {connections.map((conn) => (
              <SelectItem key={conn.id} value={conn.id}>
                {conn.catalogueName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Dataset Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getSourceIcon(catalogueDetails.source)}
                  {catalogueDetails.name}
                </CardTitle>
                <CardDescription>
                  Source: {catalogueDetails.source} • Last Profiled: {catalogueDetails.lastProfiled}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Data Summary</TabsTrigger>
            <TabsTrigger value="quality">Data Quality</TabsTrigger>
            <TabsTrigger value="columns">Column Analysis</TabsTrigger>
          </TabsList>

          {/* Data Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Top-level Metrics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Total Rows</span>
                  </div>
                  <div className="mt-1 text-2xl font-bold">{formatNumber(catalogueDetails.summary.totalRows)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Total Columns</span>
                  </div>
                  <div className="mt-1 text-2xl font-bold">{catalogueDetails.summary.totalColumns}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Missing Values</span>
                  </div>
                  <div className="mt-1 text-2xl font-bold">{formatNumber(catalogueDetails.summary.missingValues)}</div>
                  <div className="text-xs text-gray-500">{catalogueDetails.summary.missingPercentage}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Duplicated Rows</span>
                  </div>
                  <div className="mt-1 text-2xl font-bold">{formatNumber(catalogueDetails.summary.duplicatedRows)}</div>
                  <div className="text-xs text-gray-500">{catalogueDetails.summary.duplicatedPercentage}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Columns with Missing Values
                      </span>
                      <span className="font-medium">
                        {catalogueDetails.summary.columnsWithMissing}/{catalogueDetails.summary.totalColumns}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Columns with Constant Values
                      </span>
                      <span className="font-medium">{catalogueDetails.summary.constantColumns}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-blue-500" />
                        Numeric Columns
                      </span>
                      <span className="font-medium">{catalogueDetails.summary.numericColumns}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-purple-500" />
                        Categorical Columns
                      </span>
                      <span className="font-medium">{catalogueDetails.summary.categoricalColumns}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        Datetime Columns
                      </span>
                      <span className="font-medium">{catalogueDetails.summary.datetimeColumns}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        Text Columns
                      </span>
                      <span className="font-medium">{catalogueDetails.summary.textColumns}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${getQualityColor(catalogueDetails.quality.passedExpectations)}`}
                    >
                      {catalogueDetails.quality.passedExpectations}%
                    </div>
                    <div className="mt-1 text-sm text-gray-600">Passed Expectations</div>
                    <Progress value={catalogueDetails.quality.passedExpectations} className="mt-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{catalogueDetails.quality.warnings}</div>
                    <div className="mt-1 text-sm text-gray-600">Warnings</div>
                    <Badge variant={getQualityBadgeVariant(catalogueDetails.quality.warnings)} className="mt-3">
                      {catalogueDetails.quality.warnings === 0 ? "None" : `${catalogueDetails.quality.warnings} Issues`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{catalogueDetails.quality.criticalIssues}</div>
                    <div className="mt-1 text-sm text-gray-600">Critical Issues</div>
                    <Badge variant={getQualityBadgeVariant(catalogueDetails.quality.criticalIssues)} className="mt-3">
                      {catalogueDetails.quality.criticalIssues === 0
                        ? "None"
                        : `${catalogueDetails.quality.criticalIssues} Issues`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quality Issues Breakdown</CardTitle>
                <CardDescription>Detailed analysis of data quality problems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {catalogueDetails.quality.criticalIssues > 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-700">Critical Issues</span>
                      </div>
                      <ul className="space-y-1 text-sm text-red-600">
                        <li>• High null percentage in key columns &gt;20%</li>
                        <li>• Invalid data ranges detected</li>
                      </ul>
                    </div>
                  )}

                  {catalogueDetails.quality.warnings > 0 && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-yellow-700">Warnings</span>
                      </div>
                      <ul className="space-y-1 text-sm text-yellow-600">
                        <li>• Skewed distribution in numeric columns</li>
                        <li>• High cardinality in categorical columns</li>
                        <li>• Potential outliers detected</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Column Analysis Tab */}
          <TabsContent value="columns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Column Type Distribution</CardTitle>
                <CardDescription>Breakdown of column types in the dataset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg border p-4 text-center">
                    <Hash className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                    <div className="text-2xl font-bold">{catalogueDetails.summary.numericColumns}</div>
                    <div className="text-sm text-gray-600">Numeric</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <Type className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                    <div className="text-2xl font-bold">{catalogueDetails.summary.categoricalColumns}</div>
                    <div className="text-sm text-gray-600">Categorical</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <Calendar className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                    <div className="text-2xl font-bold">{catalogueDetails.summary.datetimeColumns}</div>
                    <div className="text-sm text-gray-600">Datetime</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <FileText className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                    <div className="text-2xl font-bold">{catalogueDetails.summary.textColumns}</div>
                    <div className="text-sm text-gray-600">Text</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
