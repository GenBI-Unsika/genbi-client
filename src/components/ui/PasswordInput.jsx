import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = ({
    label,
    value,
    onChange,
    placeholder,
    name,
    error,
    required = false,
    className = ''
}) => {
    const [show, setShow] = useState(false);

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    name={name}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12 outline-none transition-shadow ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label={show ? 'Sembunyikan password' : 'Lihat password'}
                >
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default PasswordInput;
