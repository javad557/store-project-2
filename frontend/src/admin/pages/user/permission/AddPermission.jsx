import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPermissions, addPermission } from "../../../services/user/permissionsService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

function AddPermission() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    roles: [],
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch roles for the dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getPermissions();
        setRoles(
          Array.isArray(response.data.roles)
            ? response.data.roles.map((role) => ({
                value: role.id,
                label: role.name,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching roles:", error);
        showError("خطا در بارگذاری نقش‌ها");
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle roles dropdown change
  const handleRolesChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      roles: selectedOptions.map((option) => ({
        id: option.value,
        name: option.label,
      })),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        roles: formData.roles.map((role) => role.id),
      };
      await addPermission(payload);
      showSuccess("دسترسی با موفقیت ایجاد شد");
      navigate("/admin/user/permissions");
    } catch (error) {
      const getErrorMessage = (error) => {
        if (!error.response) {
          return "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید";
        }
        const { status, data } = error.response;
        if (status === 422) {
          return data.errors
            ? Object.values(data.errors).flat().join("، ")
            : data.message || "داده‌های ارسالی نامعتبر است";
        } else if (status === 500) {
          return "خطایی در سرور رخ داده است. لطفاً بعداً تلاش کنید";
        }
        return "خطای ناشناخته‌ای رخ داده است";
      };
      showError(getErrorMessage(error));
    }
  };

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .form-container {
            max-width: 800px; /* Reduced max-width for less empty space */
            margin: 0 auto;
            padding: 20px;
          }
          .uniform-button {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          .roles-select {
            min-width: 100%; /* Full width for roles dropdown */
          }
          .form-group {
            margin-bottom: 1.5rem;
          }
          .textarea-resize {
            resize: vertical; /* Allow vertical resize only */
            min-height: 80px;
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ایجاد دسترسی جدید</h5>
          </section>

          <section className="form-container">
            <button
              className="btn btn-primary btn-sm uniform-button mb-4"
              onClick={() => navigate("/admin/user/permissions")}
            >
              بازگشت
            </button>

            {loading ? (
              <div className="text-center my-4">در حال بارگذاری...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">نام دسترسی</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="نام دسترسی را وارد کنید"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="description">توضیحات</label>
                    <textarea
                      className="form-control form-control-sm textarea-resize"
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="توضیحات دسترسی را وارد کنید"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="roles">نقش‌ها</label>
                  <Select
                    isMulti
                    options={roles}
                    value={roles.filter((role) =>
                      formData.roles.some((r) => r.id === role.value)
                    )}
                    onChange={handleRolesChange}
                    className="roles-select"
                    placeholder="انتخاب نقش‌ها"
                  />
                </div>

                <button type="submit" className="btn btn-success btn-sm uniform-button">
                  افزودن
                </button>
              </form>
            )}
          </section>
        </section>
      </section>
    </section>
  );
}

export default AddPermission;