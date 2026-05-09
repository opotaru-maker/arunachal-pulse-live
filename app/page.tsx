import { createClient } from '@supabase/supabase-js';

export const revalidate = 0; // Disable caching for fresh news

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: articles, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error(error);
    return <div className="p-8 text-red-500">Failed to load news</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Arunachal Pulse
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Latest News from Arunachal Pradesh and India
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-shadow border border-gray-200"
            >
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{article.source_name}</span>
                  <span>•</span>
                  <span>{new Date(article.published_at).toLocaleDateString('en-IN')}</span>
                </div>
                <h2 className="font-semibold text-lg leading-tight mb-3 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {article.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {(!articles || articles.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No news articles yet. The cron job will start fetching soon.
          </div>
        )}
      </div>
    </main>
  );
}