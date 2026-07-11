// Export utilities for PDF and CSV report generation

export interface ExportOptions {
  includeCharts?: boolean
  includeSummary?: boolean
  includeRecommendations?: boolean
  includeHistory?: boolean
}

export interface PredictionReport {
  predictionId: string
  date: string
  riskScore: number
  riskCategory: string
  clinicalData: {
    radius: number
    texture: number
    perimeter: number
    area: number
    smoothness: number
    compactness: number
    concavity: number
    symmetry: number
    fractalDimension: number
  }
  demographicData: {
    age: number
    familyHistory: boolean
    hormoneTherapy: boolean
    smoking: string
    alcohol: string
    exercise: string
    bmi: number
  }
  summary?: string
  recommendations?: string[]
  previousScores?: number[]
}

/**
 * Generate CSV export of prediction data
 */
export function generateCSV(predictions: any[]): string {
  if (predictions.length === 0) return ""

  // Header row
  const headers = [
    "Date",
    "Risk Score",
    "Risk Category",
    "Age",
    "BMI",
    "Radius",
    "Texture",
    "Perimeter",
    "Area",
    "Smoothness",
    "Compactness",
    "Concavity",
    "Symmetry",
    "Fractal Dimension",
    "Family History",
    "Hormone Therapy",
    "Smoking",
    "Alcohol",
    "Exercise",
  ]

  // Data rows
  const rows = predictions.map((pred) => [
    new Date(pred.createdAt).toLocaleDateString(),
    pred.riskScore || "",
    pred.riskCategory || "",
    pred.age || "",
    pred.bmi || "",
    pred.radius || "",
    pred.texture || "",
    pred.perimeter || "",
    pred.area || "",
    pred.smoothness || "",
    pred.compactness || "",
    pred.concavity || "",
    pred.symmetry || "",
    pred.fractalDimension || "",
    pred.familyHistory ? "Yes" : "No",
    pred.hormoneTherapy ? "Yes" : "No",
    pred.smoking || "",
    pred.alcohol || "",
    pred.exercise || "",
  ])

  // Combine headers and rows
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  return csv
}

/**
 * Download CSV file
 */
export function downloadCSV(data: string, filename: string = "predictions-report.csv") {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Generate PDF report content as HTML
 */
export function generatePDFContent(
  predictions: any[],
  userInfo: { name?: string; email?: string },
  options: ExportOptions = {}
): string {
  const {
    includeCharts = true,
    includeSummary = true,
    includeRecommendations = true,
    includeHistory = true,
  } = options

  const latestPrediction = predictions[0] || {}
  const riskDistribution = calculateRiskDistribution(predictions)
  const stats = calculateStats(predictions)

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .page { page-break-after: always; padding: 40px; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #1e40af; }
        .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; }
        .risk-card { padding: 20px; border-radius: 8px; margin: 15px 0; }
        .risk-high { background: #fee2e2; border-left: 4px solid #dc2626; }
        .risk-moderate { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .risk-low { background: #dcfce7; border-left: 4px solid #16a34a; }
        .risk-score { font-size: 32px; font-weight: bold; margin: 10px 0; }
        .data-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .data-label { font-weight: 600; color: #666; }
        .data-value { color: #333; }
        .chart { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; border: 1px solid #e5e7eb; }
        td { padding: 12px; border: 1px solid #e5e7eb; }
        tr:nth-child(even) { background: #f9fafb; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
        .disclaimer { background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 20px 0; font-size: 12px; }
      </style>
    </head>
    <body>
  `

  // Header
  html += `
    <div class="page">
      <div class="header">
        <div class="title">Breast Cancer Risk Assessment Report</div>
        <div class="subtitle">Comprehensive Health Analysis</div>
      </div>

      <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="data-row">
          <span class="data-label">Name:</span>
          <span class="data-value">${userInfo.name || "N/A"}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Email:</span>
          <span class="data-value">${userInfo.email || "N/A"}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Report Generated:</span>
          <span class="data-value">${new Date().toLocaleDateString()}</span>
        </div>
      </div>
  `

  // Current Risk Assessment
  const riskClass =
    latestPrediction.riskCategory === "high" ? "risk-high" : latestPrediction.riskCategory === "moderate" ? "risk-moderate" : "risk-low"

  html += `
    <div class="section">
      <div class="section-title">Current Risk Assessment</div>
      <div class="risk-card ${riskClass}">
        <div class="risk-score">${latestPrediction.riskScore || 0}%</div>
        <div style="font-weight: 600; font-size: 16px; margin: 10px 0;">
          ${latestPrediction.riskCategory?.toUpperCase() || "UNKNOWN"} RISK
        </div>
        <div style="margin-top: 10px; line-height: 1.8;">
          Your assessment indicates ${latestPrediction.riskCategory || "unknown"} risk for breast cancer.
          ${latestPrediction.riskCategory === "high" ? "Immediate medical consultation is recommended." : "Regular monitoring and preventive measures are advised."}
        </div>
      </div>
    </div>
  `

  // Clinical Data
  html += `
    <div class="section">
      <div class="section-title">Clinical Measurements</div>
      <div class="data-row">
        <span class="data-label">Radius:</span>
        <span class="data-value">${latestPrediction.radius || "N/A"}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Texture:</span>
        <span class="data-value">${latestPrediction.texture || "N/A"}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Perimeter:</span>
        <span class="data-value">${latestPrediction.perimeter || "N/A"}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Area:</span>
        <span class="data-value">${latestPrediction.area || "N/A"}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Compactness:</span>
        <span class="data-value">${latestPrediction.compactness || "N/A"}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Concavity:</span>
        <span class="data-value">${latestPrediction.concavity || "N/A"}</span>
      </div>
    </div>
  `

  // Summary Statistics
  if (includeSummary && predictions.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">Summary Statistics</div>
        <div class="data-row">
          <span class="data-label">Total Assessments:</span>
          <span class="data-value">${predictions.length}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Average Risk Score:</span>
          <span class="data-value">${stats.average}%</span>
        </div>
        <div class="data-row">
          <span class="data-label">Highest Risk:</span>
          <span class="data-value">${stats.max}%</span>
        </div>
        <div class="data-row">
          <span class="data-label">Lowest Risk:</span>
          <span class="data-value">${stats.min}%</span>
        </div>
        <div class="chart">
          <strong>Risk Distribution:</strong>
          <div style="margin-top: 10px;">
            Low Risk: ${riskDistribution.low} (${Math.round((riskDistribution.low / predictions.length) * 100)}%)<br/>
            Moderate Risk: ${riskDistribution.moderate} (${Math.round((riskDistribution.moderate / predictions.length) * 100)}%)<br/>
            High Risk: ${riskDistribution.high} (${Math.round((riskDistribution.high / predictions.length) * 100)}%)
          </div>
        </div>
      </div>
    `
  }

  // Recommendations
  if (includeRecommendations) {
    html += `
      <div class="section">
        <div class="section-title">Health Recommendations</div>
        <ul style="padding-left: 20px; line-height: 2;">
          <li>Regular clinical breast examinations as recommended by your healthcare provider</li>
          <li>Annual or semi-annual risk assessments based on current risk category</li>
          <li>Maintain healthy lifestyle practices including regular exercise and balanced diet</li>
          <li>Discuss supplemental screening options (ultrasound, MRI) with your physician if needed</li>
          <li>Maintain up-to-date mammography screening per guidelines for your age and risk</li>
        </ul>
      </div>
    `
  }

  // History
  if (includeHistory && predictions.length > 1) {
    html += `
      <div class="section">
        <div class="section-title">Assessment History</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Risk Score</th>
              <th>Risk Category</th>
              <th>Age</th>
              <th>BMI</th>
            </tr>
          </thead>
          <tbody>
    `

    predictions.slice(0, 10).forEach((pred) => {
      html += `
        <tr>
          <td>${new Date(pred.createdAt).toLocaleDateString()}</td>
          <td>${pred.riskScore || "N/A"}%</td>
          <td>${pred.riskCategory || "N/A"}</td>
          <td>${pred.age || "N/A"}</td>
          <td>${pred.bmi || "N/A"}</td>
        </tr>
      `
    })

    html += `
          </tbody>
        </table>
      </div>
    `
  }

  // Disclaimer
  html += `
    <div class="disclaimer">
      <strong>Medical Disclaimer:</strong> This report is for educational and awareness purposes only. 
      It does not replace professional medical diagnosis or advice. Always consult with qualified healthcare providers 
      for accurate medical assessments and treatment recommendations.
    </div>

    <div class="footer">
      <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      <p>For questions or concerns about this report, please consult with your healthcare provider.</p>
    </div>
    </div>
    </body>
    </html>
  `

  return html
}

function calculateRiskDistribution(predictions: any[]) {
  return predictions.reduce(
    (acc, pred) => {
      const category = pred.riskCategory?.toLowerCase()
      if (category === "high") acc.high++
      else if (category === "moderate") acc.moderate++
      else if (category === "low") acc.low++
      return acc
    },
    { low: 0, moderate: 0, high: 0 }
  )
}

function calculateStats(predictions: any[]) {
  const scores = predictions.map((p) => p.riskScore || 0)
  return {
    average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    min: Math.min(...scores),
    max: Math.max(...scores),
  }
}

/**
 * Convert HTML to PDF using jsPDF and html2canvas
 */
export async function generatePDF(htmlContent: string, filename: string = "report.pdf") {
  try {
    const { jsPDF } = await import("jspdf")
    const html2canvas = await import("html2canvas").then((m) => m.default)

    // Create container
    const container = document.createElement("div")
    container.innerHTML = htmlContent
    container.style.position = "absolute"
    container.style.left = "-9999px"
    container.style.width = "210mm"
    document.body.appendChild(container)

    // Convert to canvas
    const canvas = await html2canvas(container, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")

    // Create PDF
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 10

    // Add images to PDF pages
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 20

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save PDF
    pdf.save(filename)

    // Cleanup
    document.body.removeChild(container)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}
