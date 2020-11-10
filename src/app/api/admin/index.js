// @flow
import { apiPostRequest } from '../util';

import validateAdmin from '../../../validators/validate-admin';
import validateAdminLogin from '../../../validators/validate-admin-login';

export const createAdmin = async (
  admin: AdminWithPassword,
): Promise<AdminCreateValidationSummary> => {
  const result = await validateAdmin(admin);
  if (!result.isValid) {
    throw result;
  }
  return apiPostRequest('/api/admin/create', admin);
};

export const loginAdmin = async (
  credentials: AdminCredentials,
): Promise<AdminLoginValidationSummary> => {
  const result = await validateAdminLogin(credentials);
  if (!result.isValid) {
    throw result;
  }

  return apiPostRequest('/api/admin/login', credentials);
};

export const logoutAdmin = async (): Promise<boolean> => apiPostRequest('/api/admin/logout');
