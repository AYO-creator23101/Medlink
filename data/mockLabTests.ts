import { LabTest } from '../types';

export const mockLabTests: LabTest[] = [
    { 
        id: 'lt1', 
        name: 'Complete Blood Count (CBC)', 
        category: 'Hematology', 
        description: 'Measures different components of your blood, including red and white blood cells.' 
    },
    { 
        id: 'lt2', 
        name: 'Basic Metabolic Panel (BMP)', 
        category: 'Chemistry', 
        description: 'Checks levels of glucose, calcium, and electrolytes in your blood.' 
    },
    { 
        id: 'lt3', 
        name: 'Lipid Panel', 
        category: 'Chemistry', 
        description: 'Measures cholesterol and other fats in your blood to assess heart disease risk.' 
    },
    { 
        id: 'lt4', 
        name: 'Thyroid Stimulating Hormone (TSH)', 
        category: 'Hormone', 
        description: 'Screens for and monitors thyroid disorders.' 
    },
    { 
        id: 'lt5', 
        name: 'Hemoglobin A1c (HbA1c)', 
        category: 'Chemistry', 
        description: 'Monitors long-term blood sugar control in people with diabetes.' 
    },
    { 
        id: 'lt6', 
        name: 'Urinalysis', 
        category: 'Microbiology', 
        description: 'Examines urine for signs of common health problems, such as kidney disease or UTIs.' 
    },
];
