import Link from 'next/link';
import { FileText, Shield, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
            <Shield className="w-5 h-5" />
            <span className="font-poppins font-semibold text-lg">CarbonWise AI</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link 
              href="/privacy" 
              className="hover:text-green-600 dark:hover:text-green-500 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="hover:text-green-600 dark:hover:text-green-500 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Terms of Use
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-600 dark:hover:text-green-500 transition-colors flex items-center gap-1.5"
            >
              <Code className="w-4 h-4" />
              GitHub Repository
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
          &copy; {new Date().getFullYear()} CarbonWise AI. Built for the Hackathon.
        </div>
      </div>
    </footer>
  );
}
