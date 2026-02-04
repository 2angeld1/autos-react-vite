import React, { useEffect, useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Reply, 
  Calendar,
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reviewService } from '@/services/reviews';
import { Review } from '@/types/review';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = reviews.filter(r => 
      r.userName.toLowerCase().includes(term) || 
      r.comment.toLowerCase().includes(term) ||
      (r.car && `${r.car.make} ${r.car.model}`.toLowerCase().includes(term))
    );
    setFilteredReviews(filtered);
  }, [searchTerm, reviews]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAllReviews();
      setReviews(data);
      setFilteredReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id: string) => {
    try {
      const updated = await reviewService.toggleApproval(id);
      setReviews(prev => prev.map(r => r._id === id ? updated : r));
      toast.success(`Reseña ${updated.isApproved ? 'aprobada' : 'ocultada'}`);
    } catch (error) {
      toast.error('Error al cambiar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;
    try {
      await reviewService.deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success('Reseña eliminada');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleReplySubmit = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      setSubmittingReply(true);
      const updated = await reviewService.replyToReview(id, replyText);
      setReviews(prev => prev.map(r => r._id === id ? updated : r));
      setReplyText('');
      setExpandedId(null);
      toast.success('Respuesta publicada');
    } catch (error) {
      toast.error('Error al enviar respuesta');
    } finally {
      setSubmittingReply(false);
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setReplyText('');
    } else {
      setExpandedId(id);
      const review = reviews.find(r => r._id === id);
      setReplyText(review?.reply || '');
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} 
      />
    ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-indigo-400" />
            Gestión de Reseñas
          </h1>
          <p className="text-gray-400">Administra las opiniones de los usuarios sobre los vehículos</p>
        </div>
        <div className="bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-500/30">
          <span className="text-indigo-300 font-bold">{reviews.length}</span>
          <span className="text-indigo-400/70 ml-2">Reseñas totales</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por usuario, comentario o vehículo..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <div 
              key={review._id} 
              className={`bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 ${expandedId === review._id ? 'ring-1 ring-indigo-500/50' : ''}`}
            >
              <div className="p-4 flex items-start gap-4">
                {/* Avatar / Inicial */}
                <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-lg flex-shrink-0">
                  {review.userName.charAt(0).toUpperCase()}
                </div>

                {/* Contenido Principal */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {review.userName}
                        {review.isApproved ? (
                          <span className="flex items-center gap-1 text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                            <CheckCircle size={10} /> Publicado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                            <XCircle size={10} /> Oculto
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <div className="flex gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar size={12} />
                          {format(new Date(review.createdAt), 'dd MMM yyyy', { locale: es })}
                        </div>
                        {review.ip && (
                          <>
                            <span>•</span>
                            <span className="text-[10px] bg-gray-700/50 px-1.5 py-0.5 rounded">IP: {review.ip}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleApproval(review._id)}
                        className={`p-2 rounded-lg transition-colors ${review.isApproved ? 'text-green-400 hover:bg-green-400/10' : 'text-gray-400 hover:bg-white/10'}`}
                        title={review.isApproved ? "Ocultar" : "Aprobar"}
                      >
                        {review.isApproved ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </button>
                      <button 
                        onClick={() => toggleExpand(review._id)}
                        className={`p-2 rounded-lg transition-colors ${expandedId === review._id ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                        title="Responder"
                      >
                        <Reply size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {review.car && (
                    <div className="text-xs font-medium text-indigo-400 mb-2 flex items-center gap-1">
                      Vehículo: {review.car.make} {review.car.model} ({review.car.year})
                    </div>
                  )}

                  <p className="text-gray-200 mt-2 text-sm leading-relaxed">
                    "{review.comment}"
                  </p>

                  {review.reply && expandedId !== review._id && (
                    <div className="mt-4 bg-gray-900/50 p-3 rounded-lg border-l-2 border-indigo-500">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1">
                        <Reply size={12} /> TU RESPUESTA:
                      </div>
                      <p className="text-sm text-gray-300 italic">
                        {review.reply}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel de Respuesta Expandido */}
              {expandedId === review._id && (
                <div className="p-4 bg-gray-900/50 border-t border-gray-700/50 animate-fadeIn">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Reply size={14} className="text-indigo-400" /> 
                      {review.reply ? 'Editar Respuesta' : 'Responder a la reseña'}
                    </label>
                    <textarea
                      placeholder="Escribe tu respuesta aquí..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setExpandedId(null)}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleReplySubmit(review._id)}
                        disabled={submittingReply || !replyText.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
                      >
                        {submittingReply ? 'Enviando...' : (review.reply ? 'Actualizar Respuesta' : 'Publicar Respuesta')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
          <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 text-lg">No se encontraron reseñas</p>
          <button onClick={loadReviews} className="text-indigo-400 mt-2 hover:underline">Recargar página</button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
