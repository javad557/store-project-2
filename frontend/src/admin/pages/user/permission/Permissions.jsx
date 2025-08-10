import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPermissions, updatePermission, deletePermission } from "../../../services/user/permissionsService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch permissions and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const permissionsResponse = await getPermissions();
        console.log("Raw permissions response:", permissionsResponse);
        console.log("Permissions data:", permissionsResponse.data.permissions);
        console.log("Roles data:", permissionsResponse.data.roles);

        setPermissions(
          Array.isArray(permissionsResponse.data.permissions)
            ? permissionsResponse.data.permissions
            : []
        );

        setRoles(
          Array.isArray(permissionsResponse.data.roles)
            ? permissionsResponse.data.roles.map((role) => ({
                value: role.id,
                label: role.name,
              }))
            : []
        );
      }

      catch (error) {
        console.error("Error fetching data:", error);
        setPermissions([]);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (permissionId, field, value) => {
    setPermissions(
      permissions.map((permission) =>
        permission.id === permissionId
          ? { ...permission, [field]: value }
          : permission
      )
    );
  };

  // Handle roles dropdown change
  const handleRolesChange = (permissionId, selectedOptions) => {
    setPermissions(
      permissions.map((permission) =>
        permission.id === permissionId
          ? {
              ...permission,
              roles: selectedOptions.map((option) => ({
                id: option.value,
                name: option.label,
              })),
            }
          : permission
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
      return "دسترسی مورد نظر یافت نشد یا سرویس در دسترس نیست";
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

  // Update permission
  const handleUpdatePermission = async (permissionId, updatedData) => {
    try {
      const payload = {
        name: updatedData.name,
        roles: updatedData.roles.map((role) => role.id),
        description: updatedData.description,
      };
      console.log("Sending update payload:", { permissionId, payload });
      await updatePermission(permissionId, payload);
      showSuccess("دسترسی با موفقیت ویرایش شد");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  // Delete permission
  const handleDeletePermission = async (permissionId, name) => {
    const result = await Swal.fire({
      title: `آیا از حذف دسترسی "${name}" مطمئن هستید؟`,
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
        await deletePermission(permissionId);
        setPermissions(
          permissions.filter((permission) => permission.id !== permissionId)
        );
        showSuccess("دسترسی با موفقیت حذف شد");
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
          .roles-select {
            min-width: 200px;
          }
          .react-select__menu {
            z-index: 1000; /* Ensure dropdown menu appears above other elements */
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>دسترسی‌ها</h5>
          </section>

          {loading && <div className="text-center my-4">در حال بارگذاری...</div>}

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <button
              className="btn btn-success btn-sm uniform-button"
              onClick={() => navigate("/admin/user/permissions/add")}
            >
              ایجاد دسترسی جدید
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
                  <th>نام دسترسی</th>
                  <th>نقش‌ها</th>
                  <th>توضیحات</th>
                  <th className="text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {permissions.length > 0 ? (
                  permissions.map((permission, index) => (
                    <tr key={permission.id}>
                      <th>{index + 1}</th>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={permission.name || ""}
                          onChange={(e) =>
                            handleInputChange(permission.id, "name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Select
                          isMulti
                          options={roles}
                          value={roles.filter((role) =>
                            permission.roles.some((r) => r.id === role.value)
                          )}
                          onChange={(selected) =>
                            handleRolesChange(permission.id, selected)
                          }
                          className="roles-select"
                          placeholder="انتخاب نقش‌ها"
                          menuPortalTarget={document.body} // Append dropdown to body
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 1000 }), // Ensure high z-index
                          }}
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control form-control-sm"
                          value={permission.description || ""}
                          onChange={(e) =>
                            handleInputChange(
                              permission.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button
                            className="btn btn-success btn-sm position-relative me-1"
                            onClick={() =>
                              handleUpdatePermission(permission.id, {
                                name: permission.name,
                                roles: permission.roles,
                                description: permission.description,
                              })
                            }
                          >
                            <FaCheck />
                            <span className="badge bg-dark">تأیید</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm position-relative"
                            onClick={() =>
                              handleDeletePermission(permission.id, permission.name)
                            }
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
                      هیچ دسترسی‌ای یافت نشد
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

export default Permissions;