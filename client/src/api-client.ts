import { DistrictData } from "./pages/MasterDataForm/District";
import { ProductData } from "./pages/MasterDataForm/Product";
import { StateData } from "./pages/MasterDataForm/State";
import { SignInFormData } from "./pages/SignIn";
import { RegisterFormData } from "./pages/SignUp";

const API_BASE_URL = "http://localhost:4000";

export const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.user;
};

export const signUp = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.userId;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Token Invalid");
  }
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong!");
  }
};

export const createState = async (stateData: StateData) => {
  const response = await fetch(`${API_BASE_URL}/api/master/new-state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stateData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
};

export const createDistrict = async (districtData: DistrictData) => {
  const response = await fetch(`${API_BASE_URL}/api/master/new-district`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(districtData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
};

export const createProduct = async (productData: ProductData) => {
  const response = await fetch(`${API_BASE_URL}/api/master/new-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
};

export type GetRequirementsQuery = {
  state: string;
  year: string;
  product: string;
  monthGroup: string;
};

export const fetchRequirements = async (
  requirementData: GetRequirementsQuery
) => {
  const queryParams = new URLSearchParams();
  queryParams.set("state", requirementData.state);
  queryParams.set("year", requirementData.year);
  queryParams.set("product", requirementData.product);
  queryParams.set("monthGroup", requirementData.monthGroup);

  const response = await fetch(
    `${API_BASE_URL}/api/requirements?${queryParams}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.data;
};

export const createRequirements = async (requirementData: any) => {
  const response = await fetch(
    `${API_BASE_URL}/api/requirements/add-requirement`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requirementData),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
};

export const saveDataToDac = async (requirementData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dac/update-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requirementData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error("Error in saveDataToDac:", error);
    throw error;
  }
};

export const fetchDacApprovedRequirements = async (
  requirementData: Omit<GetRequirementsQuery, "state">
) => {
  const queryParams = new URLSearchParams();
  queryParams.set("year", requirementData.year);
  queryParams.set("product", requirementData.product);
  queryParams.set("monthGroup", requirementData.monthGroup);

  const response = await fetch(`${API_BASE_URL}/api/dac?${queryParams}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.data;
};

export const fetchFinalizedRequirements = async (
  requirementData: Omit<GetRequirementsQuery, "product">
) => {
  const queryParams = new URLSearchParams();
  queryParams.set("state", requirementData.state);
  queryParams.set("year", requirementData.year);
  queryParams.set("month", requirementData.monthGroup);

  const response = await fetch(`${API_BASE_URL}/api/finalized?${queryParams}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.data;
};
