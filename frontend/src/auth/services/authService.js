import axiosInstance from "../../utils/api"; // مسیر فایل api.js



export const sendOtp = async (data) => {
  return await axiosInstance.post(`/auth/sendOtp`, data);
};

export const getLoginInfo = async () => {
  return await axiosInstance.get(`/login-info`);
};


export const verifyOtp = async ({ otp_token, otp, fingerprint }) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", {
      otp_token,
      otp,
      fingerprint,
    });
    return response;
  } catch (error) {
    console.error("Error in verifyOtp:", error.response?.data || error.message);
    throw error;
  }
};

export const getRecoveryCodes = async (otpToken) => {
  try {
    const response = await axiosInstance.get(`/auth/recovery-codes`, {
      params: { otp_token: otpToken },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "خطا در دریافت رمزهای یک‌بارمصرف");
  }
};

export const verifyTwoFactor = async ({ otp_token, two_factor_code, fingerprint }) => {
  try {
    const response = await axiosInstance.post(`/auth/verify-two-factor`, {
      otp_token,
      two_factor_code,
      fingerprint,
    });
    return response;
  } catch (error) {
    console.error("Error in verifyTwoFactor:", error.response?.data || error.message);
    throw error;
  }
};


// لاگین با استفاده از otp_token
export const login = async (otpToken) => {
  try {
    console.log("Sending login request with otp_token:", otpToken); // لاگ برای دیباگ
    const response = await axiosInstance.post(`/auth/login`, {
      otp_token: otpToken,
    });
    console.log("login response:", response.data); // لاگ برای دیباگ
    if (!response.data.auth_token || response.data.is_admin === undefined) {
      throw new Error("پاسخ API لاگین ناقص است");
    }
    return response.data;
  } catch (error) {
    console.error("Error in login:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.error || "خطا در ورود");
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post(`/auth/logout`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "خطا در خروج از سیستم" };
  }
};
