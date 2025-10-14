import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, updateRole, deleteRole } from "../../../services/user/rolesService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Roles() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // دریافت نقش‌ها و دسترسی‌ها با useQuery
  const {
    data: { roles: rolesData = [], permissions: permissionsData = [] } = {},
    isLoading: isRolesLoading,
    isSuccess: isRolesSuccess,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await getRoles();
      console.log("Raw roles response:", response);
      console.log("Roles data:", response.data.roles);
      console.log("Permissions data:", response.data.permissions);
      return {
        roles: Array.isArray(response.data.roles) ? response.data.roles : [],
        permissions: Array.isArray(response.data.permissions)
          ? response.data.permissions.map((permission) => ({
              value: permission.id,
              label: permission.name,
            }))
          : [],
      };
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
      showError(error.response?.data?.error || "سرویس نقش‌ها در دسترس نیست");
    },
  });

  // تنظیم roles در state
  useEffect(() => {
    if (isRolesSuccess && rolesData) {
      console.log("Setting roles to state:", rolesData);
      setRoles(rolesData);
    }
  }, [isRolesSuccess, rolesData]);

  // به‌روزرسانی نقش با useMutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateRole(id, payload),
    onSuccess: (response) => {
      showSuccess(response.data?.message || "نقش با موفقیت ویرایش شد");
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (error) => {
      console.log(error);
      
      const errorMessage = error.response?.data?.error || "خطا در به‌روزرسانی نقش";
      showError(errorMessage);
    },
  });

  // حذف نقش با useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: (response, id) => {
      setRoles((prev) => prev.filter((role) => role.id !== id));
      showSuccess(response.data?.message || "نقش با موفقیت حذف شد");
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || "خطا در حذف نقش";
      showError(errorMessage);
    },
  });

  // مدیریت تغییرات ورودی‌ها
  const handleInputChange = (roleId, field, value) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId ? { ...role, [field]: value } : role
      )
    );
  };

  // مدیریت تغییرات دسترسی‌ها در Select
  const handlePermissionsChange = (roleId, selectedOptions) => {
    setRoles((prev) =>
      prev.map((role) =>
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

  // به‌روزرسانی نقش
  const handleUpdateRole = (roleId, updatedData) => {
    const payload = {
      name: updatedData.name || "",
      permissions: updatedData.permissions.map((permission) => permission.id),
    };
    console.log("Sending update payload:", { roleId, payload });
    updateMutation.mutate({ id: roleId, payload });
  };

  // حذف نقش
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
      deleteMutation.mutate(roleId);
    }
  };

  // فیلتر کردن نقش‌ها بر اساس جستجو
  const filteredRoles = roles.filter((role) =>
    role.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false
  );
  console.log("Filtered roles:", filteredRoles);

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

          {isRolesLoading && <div className="text-center my-4">در حال بارگذاری...</div>}
          {rolesError && (
            <div className="text-center my-4 text-danger">
              خطا در بارگذاری نقش‌ها
            </div>
          )}

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
                placeholder="جستجو بر اساس نام نقش"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th className="text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role, index) => (
                    <tr key={role.id}>
                      <th>{index + 1}</th>
                      <td>
                        <input
                          type="text"
                          className="name-input"
                          value={role.name || ""}
                          onChange={(e) =>
                            handleInputChange(role.id, "name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Select
                          isMulti
                          options={permissionsData}
                          value={permissionsData.filter((permission) =>
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
                          isDisabled={updateMutation.isLoading || deleteMutation.isLoading}
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
                              })
                            }
                            disabled={updateMutation.isLoading || deleteMutation.isLoading}
                          >
                            <FaCheck />
                            <span className="badge bg-dark">تأیید</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm position-relative"
                            onClick={() => handleDeleteRole(role.id, role.name)}
                            disabled={updateMutation.isLoading || deleteMutation.isLoading}
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
                    <td colSpan={4} className="text-center">
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