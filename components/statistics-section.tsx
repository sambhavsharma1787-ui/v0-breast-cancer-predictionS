"use client"

import React from "react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatisticsSection() {
  // Survival rates by stage
  const survivalData = [
    { stage: "Stage 0", rate: 99 },
    { stage: "Stage I", rate: 99 },
    { stage: "Stage II", rate: 93 },
    { stage: "Stage III", rate: 72 },
    { stage: "Stage IV", rate: 22 },
  ]

  // Age distribution
  const ageDistribution = [
    { age: "20-30", percentage: 2 },
    { age: "30-40", percentage: 8 },
    { age: "40-50", percentage: 18 },
    { age: "50-60", percentage: 28 },
    { age: "60-70", percentage: 25 },
    { age: "70+", percentage: 19 },
  ]

  // Risk factors
  const riskFactors = [
    { name: "Age", value: 25 },
    { name: "Family History", value: 20 },
    { name: "Hormonal Factors", value: 18 },
    { name: "Lifestyle", value: 22 },
    { name: "Other Factors", value: 15 },
  ]

  const COLORS = ["#c2185b", "#e91e63", "#f06292", "#f48fb1", "#f8bbd0"]

  const globalStats = [
    {
      number: "2.3M",
      label: "New cases annually",
      description: "Diagnosed worldwide each year",
    },
    {
      number: "685K",
      label: "Deaths annually",
      description: "Estimated annual deaths globally",
    },
    {
      number: "1 in 8",
      label: "Women in US",
      description: "Will develop breast cancer in lifetime",
    },
    {
      number: "91%",
      label: "5-year survival",
      description: "When detected early (Stage I)",
    },
  ]

  return (
    <section id="statistics" className="px-6 py-20 md:py-28 bg-secondary">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            By The Numbers
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            Breast Cancer Statistics
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Global data and survival rates highlighting the importance of early detection.
          </p>
        </div>

        {/* Global Stats Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {globalStats.map((stat, idx) => (
            <Card key={idx} className="border-border bg-card">
              <CardContent className="pt-6">
                <p className="font-display text-3xl font-bold text-primary">
                  {stat.number}
                </p>
                <p className="mt-2 font-semibold text-foreground">{stat.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Survival Rates Chart */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">5-Year Survival Rates by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={survivalData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#c2185b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Early detection significantly improves survival outcomes. Stages 0-I have near-perfect 5-year survival rates.
              </p>
            </CardContent>
          </Card>

          {/* Age Distribution */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Age Distribution of Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ageDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="percentage" stroke="#c2185b" strokeWidth={2} dot={{ fill: "#c2185b" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Risk increases with age, with peak incidence between 50-70 years old.
              </p>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Breast Cancer Risk Factor Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <Pie
                      data={riskFactors}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskFactors.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Multiple factors contribute to breast cancer risk, with modifiable lifestyle factors playing an important role in prevention.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Early Detection</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Regular screening can detect breast cancer at earlier stages when treatment is most effective.
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Survival Improvement</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              5-year survival rates have improved significantly over the past two decades due to better detection and treatment options.
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Prevention Matters</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Lifestyle modifications can reduce risk by up to 30-40%, making prevention a key strategy.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
