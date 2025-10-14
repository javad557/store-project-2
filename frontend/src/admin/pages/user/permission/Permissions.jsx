import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPermissions, updatePermission, deletePermission } from "../../../services/user/permissionsService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Permissions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // دریافت دسترسی‌ها و نقش‌ها با useQuery
  const {
    data: { permissions: permissionsData = [], roles: rolesData = [] } = {},
    isLoading: isPermissionsLoading,
    isSuccess: isPermissionsSuccess,
    error: permissionsError,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await getPermissions();
      console.log("Raw permissions response:", response);
      console.log("Permissions data:", response.data.permissions);
      console.log("Roles data:", response.data.roles);
      return {
        permissions: Array.isArray(response.data.permissions) ? response.data.permissions : [],
        roles: Array.isArray(response.data.roles)
          ? response.data.roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))
          : [],
      };
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
      showError(error.response?.data?.error || "سرویس دسترسی‌ها در دسترس نیست");
    },
  });

  // تنظیم permissions در state
  useEffect(() => {
    if (isPermissionsSuccess && permissionsData) {
      console.log("Setting permissions to state:", permissionsData);
      setPermissions(permissionsData);
    }
  }, [isPermissionsSuccess, permissionsData]);

  // به‌روزرسانی دسترسی با useMutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updatePermission(id, payload),
    onSuccess: (response) => {
      showSuccess(response.data?.message || "دسترسی با موفقیت ویرایش شد");
      queryClient.invalidateQueries(["permissions"]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || "خطا در به‌روزرسانی دسترسی";
      showError(errorMessage);
    },
  });

  // حذف دسترسی با useMutation
  const deleteMutation = useMutation({
    mutationFn: deletePermission,
    onSuccess: (response, id) => {
      setPermissions((prev) => prev.filter((permission) => permission.id !== id));
      showSuccess(response.data?.message || "دسترسی با موفقیت حذف شد");
      queryClient.invalidateQueries(["permissions"]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || "خطا در حذف دسترسی";
      showError(errorMessage);
    },
  });

  // مدیریت تغییرات ورودی‌ها
  const handleInputChange = (permissionId, field, value) => {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.id === permissionId ? { ...permission, [field]: value } : permission
      )
    );
  };

  // مدیریت تغییرات نقش‌ها در Select
  const handleRolesChange = (permissionId, selectedOptions) => {
    setPermissions((prev) =>
      prev.map((permission) =>
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

  // به‌روزرسانی دسترسی
  const handleUpdatePermission = (permissionId, updatedData) => {
    const payload = {
      name: updatedData.name || "",
      roles: updatedData.roles.map((role) => role.id),
      description: updatedData.description || "",
    };
    console.log("Sending update payload:", { permissionId, payload });
    updateMutation.mutate({ id: permissionId, payload });
  };

  // حذف دسترسی
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
      deleteMutation.mutate(permissionId);
    }
  };

  // فیلتر کردن دسترسی‌ها بر اساس جستجو
  const filteredPermissions = permissions.filter((permission) =>
    permission.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false
  );
  console.log("Filtered permissions:", filteredPermissions);

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

          {isPermissionsLoading && <div className="text-center my-4">در حال بارگذاری...</div>}
          {permissionsError && (
            <div className="text-center my-4 text-danger">
              خطا در بارگذاری دسترسی‌ها
            </div>
          )}

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
                placeholder="جستجو بر اساس نام دسترسی"
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
                  <th>نام دسترسی</th>
                  <th>نقش‌ها</th>
                  <th>توضیحات</th>
                  <th className="text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((permission, index) => (
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
                          options={rolesData}
                          value={rolesData.filter((role) =>
                            permission.roles.some((r) => r.id === role.value)
                          )}
                          onChange={(selected) =>
                            handleRolesChange(permission.id, selected)
                          }
                          className="roles-select"
                          placeholder="انتخاب نقش‌ها"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 1000 }),
                          }}
                          isDisabled={updateMutation.isLoading || deleteMutation.isLoading}
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
                            disabled={updateMutation.isLoading || deleteMutation.isLoading}
                          >
                            <FaCheck />
                            <span className="badge bg-dark">تأیید</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm position-relative"
                            onClick={() =>
                              handleDeletePermission(permission.id, permission.name)
                            }
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