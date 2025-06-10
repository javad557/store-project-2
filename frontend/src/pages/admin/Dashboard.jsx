function Dashboard() {
  const buttons = [
    { name: "دسته‌بندی محصولات", path: "/admin/categories", icon: "FaList" },
    { name: "برندها", path: "/admin/brands", icon: "FaTags" },
    { name: "محصولات", path: "/admin/products", icon: "FaBox" },
    {
      name: "تخفیف‌های عمومی",
      path: "/admin/general-discounts",
      icon: "FaPercent",
    },
    { name: "کدهای تخفیف", path: "/admin/coupon-codes", icon: "FaPercent" },
    {
      name: "تخفیف روی کالاها",
      path: "/admin/product-discounts",
      icon: "FaPercent",
    },
    {
      name: "مدیریت کاربران ادمین",
      path: "/admin/admin-users",
      icon: "FaUserShield",
    },
    { name: "مدیریت کاربران", path: "/admin/users", icon: "FaUsers" },
    { name: "مدیریت نقش‌ها", path: "/admin/roles", icon: "FaShieldAlt" },
    { name: "مدیریت سطوح دسترسی", path: "/admin/permissions", icon: "FaLock" },
    { name: "اعلامیه‌ها", path: "/admin/notifications", icon: "FaBullhorn" },
    { name: "بنرها", path: "/admin/banners", icon: "FaImage" },
    {
      name: "اولویت‌های تیکت‌ها",
      path: "/admin/ticket-priorities",
      icon: "FaStar",
    },
    {
      name: "دسته‌بندی‌های تیکت‌ها",
      path: "/admin/ticket-categories",
      icon: "FaList",
    },
    { name: "تیکت‌ها", path: "/admin/tickets", icon: "FaTicketAlt" },
    {
      name: "پیام تبریک تولد",
      path: "/admin/birthday-messages",
      icon: "FaStar",
    },
    { name: "سفارشات", path: "/admin/orders", icon: "FaShoppingCart" },
    { name: "روش‌های ارسال", path: "/admin/shipping-methods", icon: "FaTruck" },
    {
      name: "روش‌های پرداخت",
      path: "/admin/payment-methods",
      icon: "FaCreditCard",
    },
    { name: "صفحات اطلاع‌رسانی", path: "/admin/info-pages", icon: "FaFileAlt" },
    { name: "تنظیمات", path: "/admin/settings", icon: "FaCog" },
  ];

  return (
    <div className="text-end">
      <h2 className="h4 mb-4">داشبورد ادمین</h2>
      <div className="row">
        {buttons.map((button, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3 mb-3">
            <a
              href={button.path}
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-end"
            >
              <span className="ms-2">{button.name}</span>
              {button.icon && <i className={`fas ${button.icon} me-2`} />}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
