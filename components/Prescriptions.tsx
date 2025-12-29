import React, { useState, useEffect } from 'react';
import type { Prescription, GroundingChunk } from '../types';
import { findNearbyPharmacies } from '../services/geminiService';
import { 
    ArchiveBoxIcon, BuildingStorefrontIcon, CheckBadgeIcon, ChevronRightIcon, 
    ShoppingBagIcon, TruckIcon, XMarkIcon 
} from './Icons';

interface PrescriptionsProps {
    prescriptions: Prescription[];
    onUpdatePrescription: (id: string, updates: Partial<Prescription>) => void;
    location: { latitude: number; longitude: number } | null;
    locationStatus: 'idle' | 'pending' | 'success' | 'denied';
    onRequestLocation: () => void;
}

const OrderTracker: React.FC<{ status: Prescription['status'] }> = ({ status }) => {
    // FIX: Store component types instead of instances to avoid React.cloneElement with poor type inference.
    const steps: { name: Prescription['status'], icon: React.ElementType, label: string }[] = [
        { name: 'order_placed', icon: CheckBadgeIcon, label: 'Order Placed' },
        { name: 'preparing', icon: ArchiveBoxIcon, label: 'Preparing' },
        { name: 'ready_for_pickup', icon: ShoppingBagIcon, label: 'Ready for Pickup' },
        { name: 'out_for_delivery', icon: TruckIcon, label: 'Out for Delivery' },
        { name: 'completed', icon: CheckBadgeIcon, label: 'Completed' },
    ];

    const isDelivery = status === 'out_for_delivery';
    const filteredSteps = steps.filter(step => 
        isDelivery ? step.name !== 'ready_for_pickup' : step.name !== 'out_for_delivery'
    );
    
    // For completed orders, we need to know what the second to last step was.
    // This is a simplification; a real app would store the delivery type.
    const completedPath = isDelivery ? ['order_placed', 'preparing', 'out_for_delivery', 'completed'] : ['order_placed', 'preparing', 'ready_for_pickup', 'completed'];
    const activeSteps = status === 'completed' ? completedPath : steps.map(s => s.name);

    const currentStepIndex = activeSteps.indexOf(status);

    if (status === 'active' || status === 'expired') {
        return null;
    }

    return (
        <div className="mt-6">
            <ol className="flex items-center w-full text-sm font-medium text-center text-slate-500">
                {filteredSteps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isLast = index === filteredSteps.length - 1;
                    const Icon = step.icon;
                    return (
                        <li key={step.name} className={`flex items-center ${isActive ? 'text-blue-600' : ''} ${!isLast ? "w-full after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block " : ''} ${isActive ? 'after:border-blue-200' : 'after:border-slate-200'}`}>
                            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 mr-2 text-xs border ${isActive ? 'bg-blue-100 border-blue-600' : 'border-slate-300 bg-slate-100'} shrink-0`}>
                                {/* FIX: Render icon component directly with props instead of using React.cloneElement. */}
                                <Icon className="w-5 h-5" />
                            </span>
                        </li>
                    )
                })}
            </ol>
             <div className="text-center mt-2 text-lg font-semibold text-blue-700">
                {steps.find(s => s.name === status)?.label}
            </div>
        </div>
    );
};


const Prescriptions: React.FC<PrescriptionsProps> = ({ prescriptions, onUpdatePrescription, location, locationStatus, onRequestLocation }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [pharmacies, setPharmacies] = useState<GroundingChunk[]>([]);
    const [isLoadingPharmacies, setIsLoadingPharmacies] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const inProgress = prescriptions.some(p => ['order_placed', 'preparing', 'out_for_delivery', 'ready_for_pickup'].includes(p.status));
        if (!inProgress) return;

        const interval = setInterval(() => {
            const prescriptionToUpdate = prescriptions.find(p => ['order_placed', 'preparing', 'out_for_delivery', 'ready_for_pickup'].includes(p.status));
            
            if (prescriptionToUpdate) {
                let nextStatus: Prescription['status'] | null = null;
                switch (prescriptionToUpdate.status) {
                    case 'order_placed': nextStatus = 'preparing'; break;
                    case 'preparing': nextStatus = Math.random() > 0.5 ? 'out_for_delivery' : 'ready_for_pickup'; break;
                    case 'out_for_delivery': nextStatus = 'completed'; break;
                    case 'ready_for_pickup': nextStatus = 'completed'; break;
                }
                if (nextStatus) {
                    onUpdatePrescription(prescriptionToUpdate.id, { status: nextStatus });
                }
            }
        }, 6000); // Progress every 6 seconds for demo

        return () => clearInterval(interval);
    }, [prescriptions, onUpdatePrescription]);


    const handleOrderClick = async (prescription: Prescription) => {
        if (!location) {
            setSelectedPrescription(prescription);
            setIsModalOpen(true);
            setIsLoadingPharmacies(false);
            setPharmacies([]);
            if (locationStatus === 'denied') {
                setError('Location access is denied. Please enable it in your browser settings to find pharmacies.');
            } else {
                setError('We need your location to find nearby pharmacies.');
                onRequestLocation();
            }
            return;
        }
        setError('');
        setSelectedPrescription(prescription);
        setIsModalOpen(true);
        setIsLoadingPharmacies(true);
        const results = await findNearbyPharmacies(location);
        setPharmacies(results.groundingChunks.filter(c => c.maps));
        setIsLoadingPharmacies(false);
    };

    const handleSelectPharmacy = (pharmacy: GroundingChunk) => {
        if (selectedPrescription && pharmacy.maps) {
            onUpdatePrescription(selectedPrescription.id, {
                status: 'order_placed',
                pharmacy: pharmacy.maps.title,
                orderDate: new Date().toISOString(),
            });
        }
        setIsModalOpen(false);
        setSelectedPrescription(null);
        setPharmacies([]);
    };

  return (
    <>
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Prescriptions</h1>
        <p className="text-slate-500 mt-1">Manage, order, and track your medications.</p>
      </header>

      {locationStatus === 'denied' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg mb-6" role="alert">
            <p className="font-bold">Location Access Required</p>
            <p>To order medications, we need to find pharmacies near you. Please enable location access in your browser settings.</p>
          </div>
        )}

      <div className="space-y-6">
        {prescriptions.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-2xl shadow-lg transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-grow">
                     <h2 className="text-xl font-bold text-slate-800">{p.medication}</h2>
                    <p className="text-slate-600 font-medium">{p.dosage}</p>
                    <p className="text-sm text-slate-500 mt-2">Prescribed by: {p.doctor.name} ({p.doctor.specialty})</p>
                    {p.pharmacy && <p className="text-sm text-slate-500">Pharmacy: <span className="font-semibold">{p.pharmacy}</span></p>}
                </div>
                <div className="flex flex-col items-start sm:items-end flex-shrink-0 gap-2">
                    <p className="font-semibold text-slate-700">Refills Left: <span className="text-blue-600">{p.refillsLeft}</span></p>
                     <div className="w-full sm:w-48 mt-2">
                        {p.status === 'active' && (
                            <button
                                onClick={() => handleOrderClick(p)}
                                className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            >
                                Order Medication <ChevronRightIcon className="w-5 h-5"/>
                            </button>
                        )}
                        {p.status === 'expired' && (
                            <span className="font-bold text-red-500">Expired</span>
                        )}
                     </div>
                </div>
            </div>
             {p.status !== 'active' && p.status !== 'expired' && <OrderTracker status={p.status}/>}
          </div>
        ))}
      </div>
    </div>

    {/* Pharmacy Finder Modal */}
    {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg transform transition-all relative" onClick={(e) => e.stopPropagation()}>
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
                    <XMarkIcon className="w-6 h-6"/>
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Find a Pharmacy</h2>
                <p className="text-slate-500 mb-6">Select a pharmacy to send your prescription for '{selectedPrescription?.medication}'.</p>
                
                {error && <p className="text-red-500 text-center mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
                
                {isLoadingPharmacies ? (
                    <div className="text-center p-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600">Finding pharmacies near you...</p>
                    </div>
                ) : pharmacies.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {pharmacies.map((pharm, index) => (
                            <button key={index} onClick={() => handleSelectPharmacy(pharm)} className="w-full flex items-center gap-4 text-left p-4 border rounded-lg hover:bg-slate-50 hover:border-blue-500 transition-colors">
                                <BuildingStorefrontIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-slate-800">{pharm.maps?.title}</p>
                                    <a href={pharm.maps?.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>
                                        View on Map
                                    </a>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : !error ? (
                    <div className="text-center text-slate-500 p-4">
                        <p>No pharmacies found nearby.</p>
                    </div>
                ) : null}
            </div>
        </div>
    )}
    </>
  );
};

export default Prescriptions;
