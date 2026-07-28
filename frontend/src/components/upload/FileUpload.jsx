import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDocument } from '../../api/client';

export default function FileUpload({ onClose, onComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [agentSteps, setAgentSteps] = useState([
    { name: 'Parsing document', status: 'pending' },
    { name: 'Checking global events', status: 'pending' },
    { name: 'Calculating risk scores', status: 'pending' },
    { name: 'Generating recommendations', status: 'pending' },
  ]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    // Animate agent steps
    const stepDelay = 800;
    for (let i = 0; i < agentSteps.length; i++) {
      await new Promise(r => setTimeout(r, stepDelay));
      setAgentSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } :
        idx < i ? { ...s, status: 'completed' } : s
      ));
    }

    try {
      const res = await uploadDocument(file);
      setAgentSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      setResult(res);
      if (onComplete) setTimeout(() => onComplete(res), 1500);
    } catch (err) {
      setError(err.message);
      setAgentSteps(prev => prev.map(s =>
        s.status === 'running' ? { ...s, status: 'error' } : s
      ));
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass w-full max-w-lg mx-4 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Upload Document</h2>
              <p className="text-sm text-surface-400 mt-0.5">PDF, DOCX, or TXT — AI will extract shipment data</p>
            </div>
            <button onClick={onClose} className="p-1 text-surface-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drop Zone */}
          {!result && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${dragActive
                  ? 'border-brand-500 bg-brand-500/5'
                  : 'border-surface-700 hover:border-surface-500 bg-surface-900/40'
                }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {file ? (
                <div className="flex items-center gap-3 justify-center">
                  <FileText className="w-8 h-8 text-brand-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-surface-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-surface-500 mx-auto mb-3" />
                  <p className="text-sm text-surface-300 mb-1">Drag & drop your file here</p>
                  <p className="text-xs text-surface-500">or click to browse</p>
                </>
              )}
            </div>
          )}

          {/* Agent Steps */}
          {(uploading || result) && (
            <div className="mt-4 space-y-3">
              {agentSteps.map((step, i) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-risk-low flex-shrink-0" />}
                  {step.status === 'running' && <Loader2 className="w-5 h-5 text-brand-400 animate-spin flex-shrink-0" />}
                  {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-surface-700 flex-shrink-0" />}
                  {step.status === 'error' && <AlertCircle className="w-5 h-5 text-risk-critical flex-shrink-0" />}
                  <span className={`text-sm ${
                    step.status === 'completed' ? 'text-surface-200' :
                    step.status === 'running' ? 'text-brand-400 font-medium' :
                    step.status === 'error' ? 'text-risk-critical' :
                    'text-surface-500'
                  }`}>
                    {step.name}...
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-risk-low/10 border border-risk-low/20 rounded-lg"
            >
              <p className="text-sm font-medium text-risk-low mb-1">✓ Analysis Complete</p>
              <p className="text-xs text-surface-300">{result.message}</p>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-risk-critical/10 border border-risk-critical/20 rounded-lg">
              <p className="text-sm text-risk-critical">{error}</p>
            </div>
          )}

          {/* Actions */}
          {!result && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-surface-300
                  bg-surface-800/60 border border-surface-700/50 rounded-lg
                  hover:bg-surface-700/60 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white
                  bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg
                  hover:from-brand-600 hover:to-brand-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all shadow-lg shadow-brand-500/20"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </span>
                ) : 'Analyze Document'}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
