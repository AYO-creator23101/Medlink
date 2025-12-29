import React, { useState } from 'react';
import type { Insurance, SubscriptionPlan } from '../types';
import { PlusIcon, StarIcon } from './Icons';
import { mockSubscriptions } from '../data/mockSubscriptions';

const mockInsurance: Insurance[] = [
  {
    id: '1',
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'XG123456789',
    documentName: 'insurance_card.pdf',
  },
];

const paymentPlatforms = ['Cash App', 'Paystack', 'Zelle'];

const Wallet: React.FC = () => {
  const [insurancePlans, setInsurancePlans] = useState<Insurance[]>(mockInsurance);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Insurance | null>(null);

  const [provider, setProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [documentName, setDocumentName] = useState<string | undefined>('');
  
  const [walletBalance, setWalletBalance] = useState(75.50);
  const [isAddFundsVisible, setIsAddFundsVisible] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [addFundsError, setAddFundsError] = useState('');
  
  const [planType, setPlanType] = useState<'individual' | 'corporate'>('individual');
  const [currentUserSubscription, setCurrentUserSubscription] = useState<string | null>('ind_monthly');

  const handleShowForm = (plan: Insurance | null = null) => {
    setEditingPlan(plan);
    setProvider(plan?.provider || '');
    setPolicyNumber(plan?.policyNumber || '');
    setDocumentName(plan?.documentName);
    setIsFormVisible(true);
  };

  const handleHideForm = () => {
    setIsFormVisible(false);
    setEditingPlan(null);
    setProvider('');
    setPolicyNumber('');
    setDocumentName(undefined);
  };
  
  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if(editingPlan) {
          setInsurancePlans(insurancePlans.map(p => p.id === editingPlan.id ? { ...p, provider, policyNumber, documentName } : p));
      } else {
          const newPlan: Insurance = {
              id: Date.now().toString(),
              provider,
              policyNumber,
              documentName,
          };
          setInsurancePlans([...insurancePlans, newPlan]);
      }
      handleHideForm();
  };
  
  const handleRemove = (id: string) => {
      setInsurancePlans(insurancePlans.filter(p => p.id !== id));
  };
  
  const handleAddFunds = () => {
      setAddFundsError('');
      const amount = parseFloat(addAmount);
      if (isNaN(amount) || amount <= 0) {
          setAddFundsError("Please enter a valid amount.");
          return;
      }
      if (!selectedPlatform) {
          setAddFundsError("Please select a payment platform.");
          return;
      }

      setWalletBalance(prev => prev + amount);
      
      // Reset and close modal
      setAddAmount('');
      setSelectedPlatform('');
      setIsAddFundsVisible(false);
  };

  const maskPolicyNumber = (num: string) => {
      return `**** **** **** ${num.slice(-4)}`;
  }

  const handleSubscribe = (planId: string) => {
    setCurrentUserSubscription(planId);
  };

  const displayedPlans = mockSubscriptions.filter(p => p.type === planType);


  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Wallet & Insurance</h1>
        <p className="text-slate-500 mt-1">Manage your insurance plans and payment methods.</p>
      </header>

      {/* Top section for Wallet & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Wallet Balance</h2>
            <p className="text-4xl font-bold text-slate-900 mb-4">${walletBalance.toFixed(2)}</p>
            <button onClick={() => { setIsAddFundsVisible(true); setAddFundsError(''); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-5 h-5" />
                Add Funds
            </button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Payment Methods</h2>
            <div className="space-y-3">
               <div className="border border-slate-200 rounded-lg p-4">
                    <p className="font-semibold text-slate-700">Visa **** 4242</p>
                    <p className="text-sm text-slate-500">Expires 12/2026</p>
               </div>
               <button className="w-full mt-2 text-center text-blue-600 font-semibold p-2 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Add New Card
               </button>
            </div>
        </div>
      </div>

      {/* Subscription Plans Section */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Subscription Plans</h2>
                <div className="mt-4 sm:mt-0 flex items-center p-1 bg-slate-100 rounded-full">
                    <button
                        onClick={() => setPlanType('individual')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${planType === 'individual' ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}
                    >
                        Individual
                    </button>
                    <button
                        onClick={() => setPlanType('corporate')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${planType === 'corporate' ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}
                    >
                        Corporate
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPlans.map(plan => {
                    const isCurrentPlan = currentUserSubscription === plan.id;
                    return (
                        <div key={plan.id} className={`relative border-2 rounded-2xl p-6 flex flex-col transition-all ${isCurrentPlan ? 'border-blue-600' : 'border-slate-200'} ${plan.isPopular && !isCurrentPlan ? 'border-blue-400' : ''}`}>
                            {plan.isPopular && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                                    <StarIcon className="w-4 h-4" />
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                            <div className="my-4">
                                <span className="text-4xl font-extrabold text-slate-900">${plan.price.toFixed(2)}</span>
                                <span className="text-slate-500"> / {plan.period}</span>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-600 flex-grow mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={isCurrentPlan}
                                className={`w-full py-3 font-semibold rounded-lg transition-colors ${isCurrentPlan ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                {isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
      
      {/* Insurance Section */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Insurance Information</h2>
                <button onClick={() => handleShowForm()} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    Add Insurance
                </button>
            </div>
            
            {isFormVisible ? (
                <form onSubmit={handleSave} className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">{editingPlan ? 'Edit' : 'Add'} Insurance Plan</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="provider" className="block text-sm font-medium text-slate-600">Insurance Provider</label>
                            <input type="text" id="provider" value={provider} onChange={e => setProvider(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                         <div>
                            <label htmlFor="policyNumber" className="block text-sm font-medium text-slate-600">Policy Number</label>
                            <input type="text" id="policyNumber" value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="document" className="block text-sm font-medium text-slate-600">Upload Card/Document</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <div className="flex text-sm text-slate-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => setDocumentName(e.target.files?.[0].name)} /></label><p className="pl-1">or drag and drop</p></div>
                                    <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
                                    {documentName && <p className="text-sm text-green-600 pt-2">File: {documentName}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={handleHideForm} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Save Plan</button>
                    </div>
                </form>
            ) : null}

            <div className="space-y-4">
                {insurancePlans.length > 0 ? insurancePlans.map(plan => (
                    <div key={plan.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-start">
                       <div>
                            <h3 className="font-bold text-lg text-blue-700">{plan.provider}</h3>
                            <p className="text-slate-600 font-mono tracking-wider">{maskPolicyNumber(plan.policyNumber)}</p>
                            {plan.documentName && <a href="#" className="text-sm text-blue-600 hover:underline mt-1 block">{plan.documentName}</a>}
                       </div>
                       <div className="flex gap-2">
                           <button onClick={() => handleShowForm(plan)} className="text-sm font-medium text-slate-600 hover:text-black">Edit</button>
                           <button onClick={() => handleRemove(plan.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Remove</button>
                       </div>
                    </div>
                )) : (
                    !isFormVisible && <p className="text-center text-slate-500 py-4">You have no insurance plans saved.</p>
                )}
            </div>
        </div>
      </div>
      
      {/* Add Funds Modal */}
      {isAddFundsVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md transform transition-all"  onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Add Funds to Your Wallet</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-1">Amount (USD)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">$</span>
                            <input 
                                type="number" 
                                id="amount" 
                                value={addAmount}
                                onChange={e => setAddAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Select Platform</label>
                        <div className="grid grid-cols-3 gap-2">
                            {paymentPlatforms.map(platform => (
                                <button key={platform} onClick={() => setSelectedPlatform(platform)} className={`px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${selectedPlatform === platform ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}>
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                 {addFundsError && <p className="text-red-500 text-sm mt-4">{addFundsError}</p>}
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={() => setIsAddFundsVisible(false)} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                    <button type="button" onClick={handleAddFunds} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Add ${addAmount || '0.00'}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;