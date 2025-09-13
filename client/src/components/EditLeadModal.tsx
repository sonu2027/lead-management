import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// Validation schema
const leadSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
});

type LeadFormData = yup.InferType<typeof leadSchema>;

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onLeadUpdated: () => void;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ isOpen, onClose, lead, onLeadUpdated }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<LeadFormData>({
    resolver: yupResolver(leadSchema)
  });

  useEffect(() => {
    if (lead) {
      setValue('name', lead.name);
      setValue('email', lead.email);
      setValue('phone', lead.phone);
      setSubmitMessage(null);
    }
  }, [lead, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    if (!lead) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, data);
      
      if (response.data.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Lead updated successfully!'
        });
        
        setTimeout(() => {
          onLeadUpdated();
          onClose();
          reset();
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update lead. Please try again.';
      setSubmitMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitMessage(null);
    onClose();
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Lead</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="edit-name"
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="edit-email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              id="edit-phone"
              {...register('phone')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>


          {/* Success/Error Message */}
          {submitMessage && (
            <div
              className={`p-3 rounded-md ${
                submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              } text-white`}
            >
              {isSubmitting ? 'Updating...' : 'Update Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
