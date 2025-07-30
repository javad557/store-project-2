// src/admin/pages/market/comments/Comments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComments, changeCommentStatus } from '../../../services/market/commentService.js';
import { showSuccess, showError } from '../../../../utils/notifications.jsx';
import { FaCheck, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredCommentId, setHoveredCommentId] = useState(null); // حالت برای کامنت هاور شده

  // دریافت نظرات
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(search, statusFilter === 'all' ? '' : statusFilter);
        console.log('پاسخ API از سرور:', JSON.stringify(response.data, null, 2)); // تنها لاگ
        const commentsData = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setComments(commentsData);
      } catch (error) {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [search, statusFilter]);

  // تغییر وضعیت نظر
  const handleChangeStatus = async (commentId, status) => {
    try {
      await changeCommentStatus(commentId, { status });
      setComments(comments.map((comment) =>
        comment.id === commentId ? { ...comment, status } : comment
      ));
      const statusText = status === 2 ? 'تأیید' : status === 1 ? 'عدم تأیید' : 'بررسی نشده';
      showSuccess(`نظر با موفقیت ${statusText} شد`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.join('، ') ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        'تغییر وضعیت نظر با خطا مواجه شد';
      showError(errorMessage);
    }
  };

  // مدیریت هاور
  const handleMouseEnter = (commentId) => {
    setHoveredCommentId(commentId);
  };

  const handleMouseLeave = () => {
    setHoveredCommentId(null);
  };

  // استایل‌های inline
  const styles = `
    .filter-buttons .btn {
      transition: transform 0.2s;
      position: relative;
    }
    .filter-buttons .btn.active {
      font-weight: bold;
      transform: scale(1.1);
      border-width: 2px;
    }
    .action-buttons .btn {
      position: relative;
      transition: all 0.2s ease;
      margin-left: 5px;
    }
    .action-buttons .btn .badge {
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
    .action-buttons .btn:hover .badge {
      display: block;
      animation: fadeInOut 4s ease-in-out forwards;
    }
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(50%) translateY(5px); }
      20% { opacity: 1; transform: translateX(50%) translateY(0); }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translateX(50%) translateY(5px); }
    }
    .btn-highlight {
      transform: scale(1.2); /* بزرگ‌تر کردن دکمه */
      font-weight: 700; /* پررنگ‌تر کردن متن */
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.4); /* سایه قوی‌تر */
      opacity: 1; /* اطمینان از پررنگ بودن */
    }
    .table td, .table th {
      vertical-align: middle;
      padding: 0.5rem;
      position: relative; /* برای موقعیت‌دهی tooltip */
    }
    .comment-tooltip {
      position: absolute;
      top: calc(100% - 7px); /* 70 پیکسل بالاتر */
      left: 50%;
      transform: translateX(-50%) translateY(-65px); /* هماهنگ با موقعیت جدید */
      background-color: #333;
      color: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 1000;
      max-width: 1200px; /* عرض 4 برابر (300px -> 1200px) */
      min-width: 600px; /* حداقل عرض برای اطمینان */
      white-space: normal;
      word-wrap: break-word;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, transform 0.3s ease; /* انیمیشن نرم */
      border: 1px solid #ff0000; /* برای دیباگ موقت */
    }
    .comment-cell:hover .comment-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(-70px); /* حرکت 5 پیکسل به بالا */
    }
    .table-hover tbody tr:hover {
      background-color: #f8f9fa; /* برای هماهنگی با table-hover */
    }
  `;

  return (
    <section className="row" dir="rtl">
      <style>{styles}</style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت نظرات</h5>
          </section>

          {loading ? (
            <div className="text-center my-4">در حال بارگذاری...</div>
          ) : null}

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <div className="filter-buttons">
              <button
                className={`btn btn-sm uniform-button ${statusFilter === 'all' ? 'btn-warning active' : 'btn-outline-warning'}`}
                onClick={() => setStatusFilter('all')}
              >
                همه
              </button>
              <button
                className={`btn btn-sm uniform-button ${statusFilter === 0 ? 'btn-warning active' : 'btn-outline-warning'}`}
                onClick={() => setStatusFilter(0)}
              >
                بررسی نشده
              </button>
              <button
                className={`btn btn-sm uniform-button ${statusFilter === 2 ? 'btn-success active' : 'btn-outline-success'}`}
                onClick={() => setStatusFilter(2)}
              >
                تأیید شده
              </button>
              <button
                className={`btn btn-sm uniform-button ${statusFilter === 1 ? 'btn-danger active' : 'btn-outline-danger'}`}
                onClick={() => setStatusFilter(1)}
              >
                تأیید نشده
              </button>
            </div>
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="جستجوی نظر..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '200px' }}
              />
            </div>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>نویسنده</th>
                  <th>محصول</th>
                  <th>خلاصه نظر</th>
                  <th>تاریخ</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <tr
                      key={comment.id}
                      onMouseEnter={() => handleMouseEnter(comment.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <td>{comment.user?.name || 'نامشخص'}</td>
                      <td>{comment.product?.name || 'نامشخص'}</td>
                      <td className="comment-cell">
                        <span>
                          {comment.body.length > 33
                            ? `${comment.body.substring(0, 33)}...`
                            : comment.body}
                        </span>
                        {comment.body.length > 33 && hoveredCommentId === comment.id && (
                          <div className="comment-tooltip">
                            {comment.body}
                          </div>
                        )}
                      </td>
                      <td>{comment.created_at ? new Date(comment.created_at).toLocaleDateString('fa-IR') : 'نامشخص'}</td>
                      <td>
                        <div className="action-buttons d-flex align-items-center">
                          <button
                            className={`btn btn-success btn-sm position-relative ${comment.status === 2 ? 'btn-highlight' : ''}`}
                            style={{ backgroundColor: '#4caf50', borderColor: '#388e3c' }}
                            onClick={() => handleChangeStatus(comment.id, 2)}
                          >
                            <FaCheck />
                            <span className="badge bg-dark">تأیید</span>
                          </button>
                          <button
                            className={`btn btn-danger btn-sm position-relative ${comment.status === 1 ? 'btn-highlight' : ''}`}
                            style={{ backgroundColor: '#f44336', borderColor: '#d32f2f' }}
                            onClick={() => handleChangeStatus(comment.id, 1)}
                          >
                            <FaTimes />
                            <span className="badge bg-dark">عدم تأیید</span>
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      هیچ نظری یافت نشد
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
};

export default Comments;