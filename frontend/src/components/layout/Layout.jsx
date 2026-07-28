import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Upload, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import FileUpload from '../upload/FileUpload';

export default function Layout({ onUploadComplete }) {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar />

      <div className="flex-1 ml-[240px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3
          bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/40">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="text"
                placeholder="Search shipments, incidents, reports..."
                className="w-full pl-10 pr-4 py-2 bg-surface-900/60 border border-surface-700/50
                  rounded-lg text-sm text-surface-200 placeholder-surface-500
                  focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20
                  transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600
                text-white text-sm font-medium rounded-lg hover:from-brand-600 hover:to-brand-700
                transition-all duration-200 shadow-lg shadow-brand-500/20"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>

            <button className="relative p-2 text-surface-400 hover:text-surface-200 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-risk-critical rounded-full" />
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-violet
              flex items-center justify-center text-white text-xs font-bold">
              LC
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <FileUpload
          onClose={() => setShowUpload(false)}
          onComplete={(result) => {
            setShowUpload(false);
            if (onUploadComplete) onUploadComplete(result);
          }}
        />
      )}
    </div>
  );
}
