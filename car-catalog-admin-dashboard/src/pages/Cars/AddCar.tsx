import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CarForm } from '@/pages/Cars';
import { Breadcrumb } from '@/components/layout';
import { usePost } from '@/hooks/useApi';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { ArrowLeft, Car, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const AddCar: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { execute: createCar, loading } = usePost();

    const handleCarSubmit = async (formData: FormData) => {
        const result = await createCar('/cars', formData);

        if (result) {
            toast.success(t('messages.carCreated') || 'Car created successfully');
            navigate('/cars');
        }
        // If result is null, the error was handled by useApi/api interceptor
    };

    const breadcrumbItems = [
        { label: t('nav.cars'), href: '/cars' },
        { label: t('cars.addCar'), current: true },
    ];

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
            </div>

            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-primary-500 to-primary-700 text-white overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Plus className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{t('cars.addCar')}</h1>
                            <p className="text-primary-100 mt-1">
                                {t('cars.heroDescription')}
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-primary-100">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-sm">Pro tip: Complete all fields for better visibility</span>
                    </div>
                </div>
            </Card>

            {/* Form Card */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                        <div className="p-2 bg-primary-100 rounded-lg">
                            <Car className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{t('cars.carDetails')}</h2>
                                <p className="text-sm text-gray-500">{t('cars.heroDescription')}</p>
                        </div>
                    </div>
                    <CarForm
                        isOpen={true}
                        onClose={() => navigate('/cars')}
                        onSubmit={handleCarSubmit}
                        loading={loading}
                    />
                </div>
            </Card>
        </div>
    );
};

export default AddCar;