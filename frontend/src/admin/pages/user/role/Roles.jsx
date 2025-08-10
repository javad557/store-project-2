import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRoles, updateRole, deleteRole } from "../../../services/user/rolesService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch roles and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await getRoles();
        console.log("Raw roles response:", rolesResponse);
        console.log("Roles data:", rolesResponse.data.roles);
        console.log("Permissions data:", rolesResponse.data.permissions);

        setRoles(
          Array.isArray(rolesResponse.data.roles)
            ? rolesResponse.data.roles
            : []
        );

        setPermissions(
          Array.isArray(rolesResponse.data.permissions)
            ? rolesResponse.data.permissions.map((permission) => ({
                value: permission.id,
                label: permission.name,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setRoles([]);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (roleId, field, value) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId ? { ...role, [field]: value } : role
      )
    );
  };

  // Handle permissions dropdown change
  const handlePermissionsChange = (roleId, selectedOptions) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: selectedOptions.map((option) => ({
                id: option.value,
                name: option.label,
              })),
            }
          : role
      )
    );
  };

  // Handle API errors
  const getErrorMessage = (error) => {
    if (!error.response) {
      return "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید";
    }

    const { status, data } = error.response;
    console.log("API error response:", data);

    if (status === 404) {
      return "نقش مورد نظر یافت نشد یا سرویس در دسترس نیست";
    } else if (status === 422) {
      if (data.errors) {
        if (typeof data.errors === "object") {
          return Object.values(data.errors).flat().join("، ");
        } else if (Array.isArray(data.errors)) {
          return data.errors.join("، ");
        }
      } else if (data.error) {
        return data.error;
      } else if (data.message) {
        return data.message;
      }
      return "داده‌های ارسالی نامعتبر است";
    } else if (status === 500) {
      return "خطایی در سرور رخ داده است. لطفاً بعداً تلاش کنید";
    }
    return "خطای ناشناخته‌ای رخ داده است";
  };

  // Update role
  const handleUpdateRole = async (roleId, updatedData) => {
    try {
      const payload = {
        name: updatedData.name,
        permissions: updatedData.permissions.map((permission) => permission.id),
        description: updatedData.description,
      };
      console.log("Sending update payload:", { roleId, payload });
      await updateRole(roleId, payload);
      showSuccess("نقش با موفقیت ویرایش شد");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  // Delete role
  const handleDeleteRole = async (roleId, name) => {
    const result = await Swal.fire({
      title: `آیا از حذف نقش "${name}" مطمئن هستید؟`,
      text: "این عملیات قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف کن!",
      cancelButtonText: "لغو",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteRole(roleId);
        setRoles(roles.filter((role) => role.id !== roleId));
        showSuccess("نقش با موفقیت حذف شد");
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        showError(errorMessage);
      }
    }
  };

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .btn-group .btn {
            transition: none;
          }
          .btn .badge {
            display: none;
            position: absolute;
            bottom: -35px;
            right: 50%;
            transform: translateX(50%);
            background-color: #000;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            line-height: 1.2;
          }
          .btn:hover .badge {
            display: block;
            animation: fadeInOut 4s ease-in-out forwards;
          }
          @keyframes fadeInOut {
            0% {
              opacity: 0;
              transform: translateX(50%) translateY(5px);
            }
            20% {
              opacity: 1;
              transform: translateX(50%) translateY(0);
            }
            80% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translateX(50%) translateY(5px);
            }
          }
          .uniform-button {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          .table td, .table th {
            vertical-align: middle;
            padding: 0.5rem;
          }
          .permissions-select {
            min-width: 200px;
          }
          .react-select__menu {
            z-index: 1000;
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>نقش‌ها</h5>
          </section>

          {loading && <div className="text-center my-4">در حال بارگذاری...</div>}

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <button
              className="btn btn-success btn-sm uniform-button"
              onClick={() => navigate("/admin/user/roles/add")}
            >
              ایجاد نقش جدید
            </button>
            <div className="max-width-16-rem">
              <input
                type="text"
                className="form-control form-control-sm form-text"
                placeholder="جستجو"
              />
            </div>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام نقش</th>
                  <th>دسترسی‌ها</th>
                  <th>توضیحات</th>
                  <th className="text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <tr key={role.id}>
                      <th>{index + 1}</th>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={role.name || ""}
                          onChange={(e) =>
                            handleInputChange(role.id, "name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Select
                          isMulti
                          options={permissions}
                          value={permissions.filter((permission) =>
                            role.permissions.some((p) => p.id === permission.value)
                          )}
                          onChange={(selected) =>
                            handlePermissionsChange(role.id, selected)
                          }
                          className="permissions-select"
                          placeholder="انتخاب دسترسی‌ها"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 1000 }),
                          }}
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control form-control-sm"
                          value={role.description || ""}
                          onChange={(e) =>
                            handleInputChange(role.id, "description", e.target.value)
                          }
                        />
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button
                            className="btn btn-success btn-sm position-relative me-1"
                            onClick={() =>
                              handleUpdateRole(role.id, {
                                name: role.name,
                                permissions: role.permissions,
                                description: role.description,
                              })
                            }
                          >
                            <FaCheck />
                            <span className="badge bg-dark">تأیید</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm position-relative"
                            onClick={() => handleDeleteRole(role.id, role.name)}
                          >
                            <FaTrashAlt />
                            <span className="badge bg-dark">حذف</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      هیچ نقشی یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Roles;