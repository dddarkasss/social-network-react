import { Link, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store';
import Post from '../components/Post';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const {searchContent} = useAppStore();
  
  const results = searchContent(query);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Search Results for "{query}"</h2>
      
      <div className="space-y-6">
        {results.map(result => (
          <div key={result.item.id}>
            {result.type === 'user' ? (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center space-x-4">
                  <Link to={`/user/${result.item.id}`}>
                    <img
                      src={result.item.avatar}
                      alt={result.item.name}
                      className="w-16 h-16 rounded-full"
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/user/${result.item.id}`}
                      className="font-semibold text-lg text-gray-900 hover:underline"
                    >
                      {result.item.name}
                    </Link>
                    <p className="text-gray-500">{result.item.title}</p>
                  </div>
                </div>
              </div>
            ) : (
              <Post post={result.item} />
            )}
          </div>
        ))}

        {results.length === 0 && (
          <p className="text-gray-500 text-center py-8">No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
}