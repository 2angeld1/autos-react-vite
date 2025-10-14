import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CarForm } from '@/pages/Cars';
import { Breadcrumb } from '@/components/layout';
import { usePost } from '@/hooks/useApi';
import toast from 'react-hot-toast';

const AddCar: React.FC = () => {
    const navigate = useNavigate();
    const { execute: createCar, loading } = usePost();

    const handleCarSubmit = async (formData: FormData) => {
        try {
            await createCar('/cars', formData);
            toast.success('Car created successfully');
            navigate('/cars');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const breadcrumbItems = [
        { label: 'Cars', href: '/cars' },
        { label: 'Add Car', current: true },
    ];

    return (
        <div className="space-y-6">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Car</h1>
                <CarForm
                    isOpen={true}
                    onClose={() => navigate('/cars')}
                    onSubmit={handleCarSubmit}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default AddCar;