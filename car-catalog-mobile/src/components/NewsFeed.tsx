import React, { useEffect, useState } from 'react';
import { IonIcon, IonSkeletonText } from '@ionic/react';
import { newspaper, openOutline } from 'ionicons/icons';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';


interface NewsItem {
    id: string;
    title: string;
    category: string;
    time: string;
    image: string;
    link: string;
}

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchNews = async () => {
         try {
             // Using RSS2JSON to fetch Motor1 RSS Feed (free, no key needed for basic usage)
             const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://es.motor1.com/rss/news/all/');
             const data = await response.json();
             
             if (data.status === 'ok') {
                 const formattedNews = data.items.slice(0, 5).map((item: any) => ({
                     id: item.guid || item.link,
                     title: item.title,
                     category: 'Motor1', 
                     time: item.pubDate,
                     image: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80',
                     link: item.link
                 }));
                 setNews(formattedNews);
             } else {
                 throw new Error("Feed error");
             }
         } catch (error) {
             console.error("Failed to fetch news", error);
             // Fallback data
             setNews([
                 { id: '1', title: "Nuevo Porsche 911 Híbrido Revelado", category: "Novedades", time: new Date().toISOString(), image: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80", link: "#" },
                 { id: '2', title: "Tesla baja precios nuevamente", category: "Mercado", time: new Date().toISOString(), image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80", link: "#" }
             ]);
         } finally {
             setLoading(false);
         }
     };

     fetchNews();
  }, []);

  return (
    <div className="px-6 mb-8">
       <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <IonIcon icon={newspaper} size="small" />
            </div>
            <span>Noticias Recientes</span>
         </div>
       </h3>

       <div className="space-y-4">
         {loading ? (
             // Skeletons
             [1, 2, 3].map(i => (
                 <div key={i} className="flex gap-4">
                     <IonSkeletonText animated className="w-24 h-24 rounded-2xl !mt-0" />
                     <div className="flex-1 space-y-2 py-2">
                         <IonSkeletonText animated style={{ width: '30%' }} />
                         <IonSkeletonText animated style={{ width: '80%' }} />
                         <IonSkeletonText animated style={{ width: '40%' }} />
                     </div>
                 </div>
             ))
         ) : (
            news.map(item => (
                <a 
                   key={item.id} 
                   href={item.link}
                   target="_blank"
                   rel="noreferrer"
                   className="group block bg-white p-3 rounded-[1.5rem] flex gap-4 items-start shadow-sm border border-slate-100 active:scale-[0.98] transition-all hover:shadow-md"
                >
                   <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative">
                       <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80';
                          }}
                        />
                   </div>
                   <div className="flex-1 py-1 min-w-0">
                      <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide bg-orange-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                              {item.category}
                          </span>
                          <IonIcon icon={openOutline} className="text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                      </h4>
                      
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          {formatDistanceToNow(new Date(item.time), { addSuffix: true, locale: es })}
                      </p>
                   </div>
                </a>
            ))
         )}
       </div>
    </div>
  );
};

export default NewsFeed;
