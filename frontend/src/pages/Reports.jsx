import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronDown, ChevronUp, Shield, Lightbulb } from 'lucide-react';
import { fetchRiskReports, downloadReport } from '../api/client';
import { getRiskBadgeClass, formatDateTime } from '../utils/formatters';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRiskReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (reportId, e) => {
    e.stopPropagation();
    try {
      await downloadReport(reportId);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-white">Risk Reports</h1>
        <p className="text-sm text-surface-400 mt-1">AI-generated risk assessments and recommendations</p>
      </motion.div>

      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))
      ) : reports.length === 0 ? (
        <div className="text-center py-16 glass rounded-xl">
          <FileText className="w-12 h-12 mx-auto mb-4 text-surface-600" />
          <p className="text-surface-400 text-sm mb-2">No reports generated yet</p>
          <p className="text-surface-500 text-xs">Upload a document or run "Analyze All Shipments" to generate reports</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, i) => (
            <motion.div
              key={report.report_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-hover overflow-hidden"
            >
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === report.report_id ? null : report.report_id)}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  report.overall_risk === 'Critical' ? 'bg-risk-critical/10' :
                  report.overall_risk === 'High' ? 'bg-risk-high/10' :
                  report.overall_risk === 'Medium' ? 'bg-risk-medium/10' :
                  'bg-risk-low/10'
                }`}>
                  <Shield className={`w-5 h-5 ${
                    report.overall_risk === 'Critical' ? 'text-risk-critical' :
                    report.overall_risk === 'High' ? 'text-risk-high' :
                    report.overall_risk === 'Medium' ? 'text-risk-medium' :
                    'text-risk-low'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-medium text-surface-200">{report.report_id}</span>
                    <span className="text-xs text-surface-500">•</span>
                    <span className="text-xs text-brand-400 font-mono">{report.shipment_id}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getRiskBadgeClass(report.overall_risk)}`}>
                      {report.overall_risk} ({report.risk_score})
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 mt-0.5">{formatDateTime(report.created_at)}</p>
                </div>

                <button
                  onClick={(e) => handleDownload(report.report_id, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                    text-brand-400 bg-brand-500/10 border border-brand-500/20
                    rounded-lg hover:bg-brand-500/20 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>

                {expandedId === report.report_id
                  ? <ChevronUp className="w-4 h-4 text-surface-500" />
                  : <ChevronDown className="w-4 h-4 text-surface-500" />
                }
              </div>

              {/* Expanded Content */}
              {expandedId === report.report_id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-5 border-t border-surface-800/30"
                >
                  {/* Reasons */}
                  {report.reasons?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-surface-300 mb-2 uppercase tracking-wider">Risk Factors</h4>
                      <div className="space-y-1.5">
                        {report.reasons.map((reason, ri) => (
                          <p key={ri} className="text-xs text-surface-400 pl-3 border-l-2 border-surface-700">
                            {reason}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {report.recommendations?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-surface-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" /> Recommendations
                      </h4>
                      <div className="space-y-2">
                        {report.recommendations.map((rec, ri) => (
                          <div key={ri} className="p-3 bg-surface-900/60 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-violet/20 text-accent-violet font-medium uppercase">
                                {rec.action_type}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRiskBadgeClass(rec.priority)}`}>
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-xs text-surface-200 mb-1">{rec.action}</p>
                            <p className="text-[11px] text-surface-500">
                              Impact: {rec.business_impact}
                            </p>
                            <p className="text-[11px] text-surface-500">
                              Cost: {rec.estimated_cost_impact} • Confidence: {Math.round(rec.confidence * 100)}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Executive Summary */}
                  {report.executive_summary && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-surface-300 mb-2 uppercase tracking-wider">Executive Summary</h4>
                      <pre className="text-xs text-surface-400 whitespace-pre-wrap font-sans leading-relaxed
                        p-3 bg-surface-900/60 rounded-lg max-h-[200px] overflow-y-auto">
                        {report.executive_summary}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
