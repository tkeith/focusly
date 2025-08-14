import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Globe } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

type URLFormData = z.infer<typeof urlSchema>;

interface URLInputFormProps {
  onArticleScraped: (article: {
    title: string;
    content: { type: "heading" | "paragraph"; level?: number; text: string; }[];
    url: string;
  }) => void;
}

export function URLInputForm({ onArticleScraped }: URLInputFormProps) {
  const trpc = useTRPC();
  const scrapeArticleMutation = useMutation(
    trpc.scrapeArticle.mutationOptions({
      onSuccess: (data) => {
        toast.success("Article loaded successfully!");
        onArticleScraped(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<URLFormData>({
    resolver: zodResolver(urlSchema),
  });

  const onSubmit = (data: URLFormData) => {
    scrapeArticleMutation.mutate({ url: data.url });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">DyslexiaAssist</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Transform any article into a dyslexia-friendly reading experience
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="url" className="sr-only">
              Article URL
            </label>
            <div className="relative">
              <input
                id="url"
                type="url"
                placeholder="Paste any article URL to make it dyslexia-friendly"
                {...register("url")}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400"
                disabled={scrapeArticleMutation.isPending}
              />
              {scrapeArticleMutation.isPending && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
              )}
            </div>
            {errors.url && (
              <p className="mt-2 text-sm text-red-600">{errors.url.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={scrapeArticleMutation.isPending}
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {scrapeArticleMutation.isPending ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading Article...
              </span>
            ) : (
              "Transform Article"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Supports news articles, blog posts, and most web content.
            <br />
            Your reading preferences will be saved automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
