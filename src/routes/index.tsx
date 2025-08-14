import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { URLInputForm } from "~/components/URLInputForm";
import { ArticleDisplay } from "~/components/ArticleDisplay";
import { Header } from "~/components/Header";
import { SettingsPanel } from "~/components/SettingsPanel";
import { FooterControls } from "~/components/FooterControls";

export const Route = createFileRoute("/")({
  component: Home,
});

interface Article {
  title: string;
  content: { type: "heading" | "paragraph"; level?: number; text: string; }[];
  url: string;
}

function Home() {
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleArticleScraped = (article: Article) => {
    setCurrentArticle(article);
  };

  const handleNewArticle = () => {
    setCurrentArticle(null);
    setIsSettingsOpen(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  // Show URL input form if no article is loaded
  if (!currentArticle) {
    return <URLInputForm onArticleScraped={handleArticleScraped} />;
  }

  // Show article view with all components
  return (
    <div className="min-h-screen">
      <Header 
        onNewArticle={handleNewArticle}
        onOpenSettings={handleOpenSettings}
      />
      
      <main className="pb-20"> {/* Add padding for footer controls */}
        <ArticleDisplay 
          title={currentArticle.title}
          content={currentArticle.content}
          url={currentArticle.url}
        />
      </main>

      <FooterControls 
        title={currentArticle.title}
        content={currentArticle.content}
      />

      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
      />
    </div>
  );
}
