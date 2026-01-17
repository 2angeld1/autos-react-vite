import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { CarForm } from '@/pages/Cars';
import { Breadcrumb } from '@/components/layout';
import { useGet, usePut } from '@/hooks/useApi';
import { Car } from '@/types';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { ArrowLeft, Car as CarIcon, Edit, Eye, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditCar: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { data: carResponse, loading, execute: fetchCar } = useGet<{
        success: boolean;
        data: Car;
    }>(`/cars/${id}`);

    const { execute: updateCar, loading: updateLoading } = usePut();

    const handleCarSubmit = async (formData: FormData) => {
        try {
            await updateCar(`/cars/${id}`, formData);
            toast.success(t('messages.carUpdated') || 'Car updated successfully');
            navigate('/cars');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const car = carResponse?.data;

    const getCarDisplayName = (c?: Car) => {
        if (!c) return '';
        const model = (c as any).model || (c as any).carModel || (c as any).modelName || (c as any).title || '';
        return `${c.make || ''} ${model}`.trim();
    }

    const breadcrumbItems = [
        { label: t('nav.cars'), href: '/cars' },
        { label: car ? getCarDisplayName(car) : t('cars.editCar'), current: true },
    ];

    React.useEffect(() => {
        if (id) {
            fetchCar('', {});
        }
    }, [id, fetchCar]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
                    <p className="text-gray-500">{t('cars.loadingDetails') || t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <CarIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">{t('cars.notFoundTitle') || 'Car not found'}</h2>
                <p className="text-gray-500 mt-2">{t('cars.notFoundMessage') || "The car you're trying to edit doesn't exist."}</p>
                <Button
                    variant="primary"
                    onClick={() => navigate('/cars')}
                    className="mt-6"
                    icon={<ArrowLeft className="h-4 w-4" />}
                >
                    {t('cars.backToList')}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Breadcrumb items={breadcrumbItems} />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/cars')}
                    icon={<ArrowLeft className="h-4 w-4" />}
                    className="self-start"
                >
                    {t('cars.backToList')}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate(`/cars/${id}`)}
                    icon={<Eye className="h-4 w-4" />}
                >
                    {t('cars.viewCar')}
                </Button>
            </div>

            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Edit className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{t('cars.editCar')}</h1>
                            <p className="text-amber-100 mt-1">
                                {getCarDisplayName(car)} {car.year}
                            </p>
                    </div>
                    {car.image && (
                        <img
                            src={car.image.startsWith('http') ? car.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${car.image}`}
                            alt={getCarDisplayName(car)}
                            className="w-24 h-16 object-cover rounded-lg shadow-lg hidden sm:block"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    )}
                </div>
            </Card>

            {/* Form Card */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <CarIcon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{t('cars.carDetails')}</h2>
                            <p className="text-sm text-gray-500">{t('cars.heroDescription')}</p>
                        </div>
                    </div>
                    <CarForm
                        car={car}
                        isOpen={true}
                        onClose={() => navigate('/cars')}
                        onSubmit={handleCarSubmit}
                        loading={updateLoading}
                    />
                </div>
            </Card>
        </div>
    );
};

export default EditCar;