import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/layout';
import { useGet } from '@/hooks/useApi';
import { Car } from '@/types';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { api } from '@/services/api'; // Asegúrate de importar api
import toast from 'react-hot-toast'; // Si no está importado
import Swal from 'sweetalert2'; // Agrega esta importación si no está

const ViewCar: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    console.log('ViewCar - id from params:', id);

    const { data: carResponse, loading, execute: fetchCar } = useGet<{
        success: boolean;
        data: Car;
    }>(`/cars/${id}`);

    // Fetch car data when component mounts or id changes
    React.useEffect(() => {
        if (id) {
            fetchCar('', {});
        }
    }, [id, fetchCar]);

    const handleEditCar = () => {
        navigate(`/cars/${id}/edit`);
    };

    const handleDeleteCar = async (car: Car) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres eliminar el auto "${car.make} ${car.model}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/cars/${car.id}`);
                toast.success('Auto eliminado exitosamente');
                // Refrescar la lista de autos
                fetchCar('', {});
            } catch (error: any) {
                toast.error(error.message || 'Error al eliminar el auto');
            }
        }
    };

    const breadcrumbItems = [
        { label: 'Cars', href: '/cars' },
        { label: 'View Car', current: true },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!carResponse?.data) {
        return <div>Car not found</div>;
    }

    const car = carResponse.data;

    return (
        <div className="space-y-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => navigate('/cars')}
                    icon={<ArrowLeft className="h-4 w-4" />}
                >
                    Back to Cars
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleEditCar}
                        icon={<Edit className="h-4 w-4" />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleDeleteCar(car)} // Cambia de console.log a handleDeleteCar
                        icon={<Trash className="h-4 w-4" />}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image */}
                    <div>
                        <img
                            src={car.image}
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {car.make} {car.model} {car.year}
                            </h1>
                            <p className="text-2xl font-semibold text-primary-600 mt-2">
                                ${car.price.toLocaleString()}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Fuel Type</span>
                                <div className="mt-1">
                                    <Badge variant="info">{car.fuel_type}</Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Transmission</span>
                                <div className="mt-1">
                                    <Badge variant="success">
                                        {car.transmission === 'a' ? 'Automatic' : 'Manual'}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Cylinders</span>
                                <p className="mt-1 text-sm text-gray-900">{car.cylinders}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Class</span>
                                <p className="mt-1 text-sm text-gray-900">{car.class}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Displacement</span>
                                <p className="mt-1 text-sm text-gray-900">{car.displacement}L</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">MPG</span>
                                <p className="mt-1 text-sm text-gray-900">
                                    City: {car.city_mpg} | Highway: {car.highway_mpg} | Combined: {car.combination_mpg}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-medium text-gray-500">Description</span>
                            <p className="mt-1 text-sm text-gray-900">{car.description}</p>
                        </div>

                        {car.features && car.features.length > 0 && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Features</span>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {car.features.map((feature, index) => (
                                        <Badge key={index} variant="info">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <span className="text-sm font-medium text-gray-500">Availability</span>
                            <div className="mt-1">
                                <Badge variant={car.isAvailable ? 'success' : 'error'}>
                                    {car.isAvailable ? 'Available' : 'Not Available'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCar;