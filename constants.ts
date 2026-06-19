/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskType, ClientType } from './types';

export const PENALTY_RATES: Record<string, number> = {
  'GSTR-1': 50,
  'GSTR-3B': 50,
  'GSTR-9': 200,
  'TDS Challan': 200,
  'TDS Return': 200,
  'ROC MGT-7': 100,
  'ROC AOC-4': 100,
  'DIR-3 KYC': 500,
  'FSSAI License': 2000,
  'Bio-Medical Waste': 1000,
  'PCPNDT': 10000,
  'Shop License': 500,
  'Professional Tax': 100,
  'Advance Tax': 0, // interest-based
  'Default': 50,
};

export const TASK_TYPES: TaskType[] = [
  'GST',
  'TDS',
  'ROC',
  'Labour',
  'License',
  'Advance Tax',
  'Professional Tax',
  'Default',
];

export const CLIENT_TYPES: ClientType[] = [
  'Private Limited',
  'LLP',
  'Partnership',
  'Proprietorship',
  'Doctor / Clinic',
  'Dentist',
  'IVF Center',
  'Hospital',
  'Restaurant',
  'Retail / Shop',
  'Manufacturing',
  'NGO / Trust',
  'Other',
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands (UT)',
  'Chandigarh (UT)',
  'Dadra and Nagar Haveli and Daman and Diu (UT)',
  'Delhi (NCT)',
  'Jammu and Kashmir (UT)',
  'Ladakh (UT)',
  'Lakshadweep (UT)',
  'Puducherry (UT)',
];
