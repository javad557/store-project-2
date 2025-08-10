import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRoles, addRole } from "../../../services/user/rolesService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

function AddRole() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch permissions for the dropdown
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getRoles();
        setPermissions(
          Array.isArray(response.data.permissions)
            ? response.data.permissions.map((permission) => ({
                value: permission.id,
                label: permission.name,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching permissions:", error);
        showError("خطا در بارگذاری دسترسی‌ها");
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle permissions dropdown change
  const handlePermissionsChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      permissions: selectedOptions.map((option) => ({
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
        permissions: formData.permissions.map((permission) => permission.id),
      };
      await addRole(payload);
      showSuccess("نقش با موفقیت ایجاد شد");
      navigate("/admin/user/roles");
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
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .uniform-button {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          .permissions-select {
            min-width: 100%;
          }
          .form-group {
            margin-bottom: 1.5rem;
          }
          .textarea-resize {
            resize: vertical;
            min-height: 80px;
          }
          .react-select__menu {
            z-index: 1000;
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ایجاد نقش جدید</h5>
          </section>

          <section className="form-container">
            <button
              className="btn btn-primary btn-sm uniform-button mb-4"
              onClick={() => navigate("/admin/user/roles")}
            >
              بازگشت
            </button>

            {loading ? (
              <div className="text-center my-4">در حال بارگذاری...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">نام نقش</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="نام نقش را وارد کنید"
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
                      placeholder="توضیحات نقش را وارد کنید"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="permissions">دسترسی‌ها</label>
                  <Select
                    isMulti
                    options={permissions}
                    value={permissions.filter((permission) =>
                      formData.permissions.some((p) => p.id === permission.value)
                    )}
                    onChange={handlePermissionsChange}
                    className="permissions-select"
                    placeholder="انتخاب دسترسی‌ها"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 1000 }),
                    }}
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

export default AddRole;