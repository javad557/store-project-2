import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addAddress, getCities, getProvinces } from "../../services/user/customerUserService";
import { showSuccess, showError } from "../../../utils/notifications";

function AddAddress() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // فرم دیتا شامل تمام فیلدهای لازم
  const [formData, setFormData] = useState({
    province_id: "",
    city_id: "",
    address: "",
    postal_code: "",
    unit: "",
    mobile: "",
    no: "",
  });

  // خطاها برای تمام فیلدها
  const [errors, setErrors] = useState({
    province_id: null,
    city_id: null,
    address: null,
    postal_code: null,
    unit: null,
    mobile: null,
    no: null,
  });

  // لود استان‌ها
  const {
    data: provinces = [],
    error: provinceError,
    isError: provinceIsError,
    isSuccess: provinceIsSuccess,
    isLoading: provinceIsLoading,
  } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await getProvinces();
      return response.data.data;
    },
  });

  // لود شهرها
  const {
    data: cities = [],
    error: cityError,
    isError: cityIsError,
    isSuccess: cityIsSuccess,
    isLoading: cityIsLoading,
  } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await getCities();
      return response.data.data;
    },
  });

  // فیلتر شهرها بر اساس استان انتخاب‌شده
  const filteredCities = formData.province_id
    ? cities.filter((city) => city.province_id === parseInt(formData.province_id))
    : cities;

  // مدیریت mutation برای ارسال فرم
  const mutation = useMutation({
    mutationFn: addAddress,
    onSuccess: (response) => {
      showSuccess(response.data.message);
      queryClient.invalidateQueries(["addresses"]);
      navigate("/main/profile/my-addresses");
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        showError("مقادیر فرم‌ها معتبر نیستند");
        const validationErrors = error.response.data.errors || {};
        setErrors({
          province_id: validationErrors.province_id?.[0] || null,
          city_id: validationErrors.city_id?.[0] || null,
          address: validationErrors.address?.[0] || null,
          postal_code: validationErrors.postal_code?.[0] || null,
          unit: validationErrors.unit?.[0] || null,
          mobile: validationErrors.mobile?.[0] || null,
          no: validationErrors.no?.[0] || null,
        });
      } else {
        showError(error.response?.data?.error || "خطایی رخ داد");
      }
    },
  });

   // تابع اعتبارسنجی برای هر فیلد
  const validateField = (name, value) => {
    switch (name) {
      case "province_id":
        if (!value.trim()) return "استان الزامی است";
        return null;
      case "city_id":
        if (!value.trim()) return "شهر الزامی است";
        return null;
      case "address":
        if (!value.trim()) return "آدرس الزامی است";
        if (value.length > 255) return "آدرس نمی‌تواند بیشتر از 255 کاراکتر باشد";
        return null;
      case "postal_code":
        if (!value.trim()) return "کد پستی الزامی است";
        if (value.length !== 10) return "کد پستی باید دقیقاً 10 رقم باشد";
        return null;
      case "no":
        if (!value.trim()) return "پلاک الزامی است";
        if (value.length > 10) return "پلاک نمی‌تواند بیشتر از 10 کاراکتر باشد";
        return null;
      case "unit":
        if (value && value.length > 10) return "واحد نمی‌تواند بیشتر از 10 کاراکتر باشد";
        return null;
      case "mobile":
        if (value && !/^09[0-9]{9}$/.test(value)) return "شماره موبایل باید 11 رقم و با 09 شروع شود";
        return null;
      default:
        return null;
    }
  };

    const hasErrors = Object.values(errors).some((error) => error !== null);

  // مدیریت تغییرات ورودی‌ها
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // پاک کردن خطای مربوط به فیلد تغییرکرده
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // مدیریت ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
        province_id: validateField("province_id", formData.province_id),
        city_id: validateField("city_id", formData.city_id),
        address: validateField("address", formData.address),
        postal_code: validateField("postal_code", formData.postal_code),
        unit: validateField("unit", formData.unit),
        no: validateField("no", formData.no),
        mobile: validateField("mobile", formData.mobile),
      };
      setErrors(newErrors);
      const hasErrors = Object.values(errors).some((error) => error !== null);
      if(!hasErrors){
            mutation.mutate(formData);
      }
  };

  return (
    <section className="row">
      <section className="content-header-link m-2">
        <Link className="btn btn-danger text-white" to="/main/profile/my-addresses">
          بازگشت
        </Link>
      </section>

      <main id="main-body" className="main-body col-md-9">
        <section className="address-add-wrapper">
          {(provinceIsLoading || cityIsLoading) && (
            <div className="text-center my-4">
              <p>در حال بارگذاری...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
            </div>
          )}

          {(provinceIsError || cityIsError) && (
            <div className="alert alert-danger text-center my-4">
              خطایی رخ داده است: {provinceError?.message || cityError?.message || "لطفاً دوباره تلاش کنید."}
            </div>
          )}

          {provinceIsSuccess && cityIsSuccess && (
            <form className="row" onSubmit={handleSubmit}>
              <section className="col-6 mb-2">
                <label htmlFor="province_id" className="form-label mb-1">
                  استان
                </label>
                <select
                  className={`form-select form-select-sm ${errors.province_id ? "is-invalid" : ""}`}
                  id="province_id"
                  name="province_id"
                  value={formData.province_id}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.province_id && <div className="invalid-feedback">{errors.province_id}</div>}
              </section>

              <section className="col-6 mb-2">
                <label htmlFor="city_id" className="form-label mb-1">
                  شهر
                </label>
                <select
                  className={`form-select form-select-sm ${errors.city_id ? "is-invalid" : ""}`}
                  id="city_id"
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  disabled={!formData.province_id} // غیرفعال تا وقتی استان انتخاب نشده
                >
                  <option value="">انتخاب کنید</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city_id && <div className="invalid-feedback">{errors.city_id}</div>}
              </section>

              <section className="col-12 mb-2">
                <label htmlFor="address" className="form-label mb-1">
                  نشانی
                </label>
                <textarea
                  className={`form-control form-control-sm ${errors.address ? "is-invalid" : ""}`}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  cols={155}
                  rows={5}
                ></textarea>
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </section>

              <section className="col-6 mb-2">
                <label htmlFor="postal_code" className="form-label mb-1">
                  کد پستی
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${errors.postal_code ? "is-invalid" : ""}`}
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
                {errors.postal_code && <div className="invalid-feedback">{errors.postal_code}</div>}
              </section>

              <section className="col-3 mb-2">
                <label htmlFor="no" className="form-label mb-1">
                  پلاک
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${errors.no ? "is-invalid" : ""}`}
                  id="no"
                  name="no"
                  value={formData.no}
                  onChange={handleChange}
                />
                {errors.no && <div className="invalid-feedback">{errors.no}</div>}
              </section>

              <section className="col-3 mb-2">
                <label htmlFor="unit" className="form-label mb-1">
                  واحد
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${errors.unit ? "is-invalid" : ""}`}
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                />
                {errors.unit && <div className="invalid-feedback">{errors.unit}</div>}
              </section>

              <section className="col-6 mb-2">
                <label htmlFor="mobile" className="form-label mb-1">
                  شماره موبایل
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${errors.mobile ? "is-invalid" : ""}`}
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
                {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
              </section>

              <section className="py-1">
                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                  disabled={mutation.isLoading || hasErrors}
                >
                  {mutation.isLoading ? "در حال ارسال..." : "افزودن"}
                </button>
              </section>
            </form>
          )}
        </section>
      </main>
    </section>
  );
}

export default AddAddress;