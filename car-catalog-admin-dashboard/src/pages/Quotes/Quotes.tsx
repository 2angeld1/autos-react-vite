import React, { useEffect, useState } from 'react';
import { Quote, quotesService } from '@/services/quotes';
import { format } from 'date-fns';
import { Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Quotes: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQuotes = async () => {
        try {
            const data = await quotesService.getQuotes();
            setQuotes(data);
        } catch (error) {
            toast.error('Error al cargar cotizaciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await quotesService.updateStatus(id, newStatus);
            toast.success('Estado actualizado');
            fetchQuotes(); // Recargar
        } catch (error) {
            toast.error('Error al actualizar estado');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'negotiating': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'closed': return 'bg-green-100 text-green-800 border-green-200';
            case 'lost': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando cotizaciones...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Cotizaciones</h1>
                    <p className="mt-1 text-sm text-gray-500">Administra los leads generados desde el catálogo.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500">Total Leads:</span>
                    <span className="ml-2 text-lg font-bold text-orange-600">{quotes.length}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo de Interés</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles Financieros</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {quotes.map((quote) => (
                                <tr key={quote._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{quote.customerName}</span>
                                            <a href={`mailto:${quote.email}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                                <Mail size={12} /> {quote.email}
                                            </a>
                                            <a href={`tel:${quote.phone}`} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-0.5">
                                                <Phone size={12} /> {quote.phone}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {quote.car?.image && (
                                                <div className="h-10 w-16 flex-shrink-0 mr-3">
                                                    <img className="h-10 w-16 rounded object-cover" src={quote.car.image} alt="" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {quote.car ? `${quote.car.year} ${quote.car.make} ${quote.car.carModel}` : 'Vehículo Eliminado'}
                                                </div>
                                                <div className="text-xs text-orange-600 font-semibold">
                                                    ${quote.car?.price?.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-600 dark:text-gray-300">
                                            <p>Enganche: <span className="font-medium">{quote.downPayment}%</span></p>
                                            <p>Plazo: <span className="font-medium">{quote.term} meses</span></p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={quote.status}
                                            onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                                            className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 ${getStatusColor(quote.status)}`}
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="contacted">Contactado</option>
                                            <option value="negotiating">Negociando</option>
                                            <option value="closed">Vendido</option>
                                            <option value="lost">Perdido</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {format(new Date(quote.createdAt), 'dd MMMM, HH:mm')}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1 uppercase">
                                            ID: {quote._id.slice(-6)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {quotes.length === 0 && (
                        <div className="text-center py-12">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay cotizaciones</h3>
                            <p className="mt-1 text-sm text-gray-500">Aún no se han generado leads.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quotes;
