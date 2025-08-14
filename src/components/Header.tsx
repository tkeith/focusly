import { Globe, Settings, Plus } from "lucide-react";

interface HeaderProps {
  onNewArticle: () => void;
  onOpenSettings: () => void;
}

export function Header({ onNewArticle, onOpenSettings }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Globe className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">DyslexiaAssist</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onNewArticle}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </button>
            
            <button
              onClick={onOpenSettings}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
