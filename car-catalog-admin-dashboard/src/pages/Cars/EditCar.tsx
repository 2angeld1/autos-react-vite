import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CarForm } from '@/pages/Cars';
import { Breadcrumb } from '@/components/layout';
import { useGet, usePut } from '@/hooks/useApi';
import { Car } from '@/types';
import toast from 'react-hot-toast';

const EditCar: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    console.log('EditCar - id from params:', id);

    const { data: carResponse, loading, execute: fetchCar } = useGet<{
        success: boolean;
        data: Car;
    }>(`/cars/${id}`);

    const { execute: updateCar, loading: updateLoading } = usePut();

    const handleCarSubmit = async (formData: FormData) => {
        try {
            await updateCar(`/cars/${id}`, formData);
            toast.success('Car updated successfully');
            navigate('/cars');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const breadcrumbItems = [
        { label: 'Cars', href: '/cars' },
        { label: 'Edit Car', current: true },
    ];

    React.useEffect(() => {
        if (id) {
            fetchCar('', {});
        }
    }, [id, fetchCar]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!carResponse?.data) {
        return <div>Car not found</div>;
    }

    return (
        <div className="space-y-6">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Car</h1>
                <CarForm
                    car={carResponse.data}
                    isOpen={true}
                    onClose={() => navigate('/cars')}
                    onSubmit={handleCarSubmit}
                    loading={updateLoading}
                />
            </div>
        </div>
    );
};

export default EditCar;