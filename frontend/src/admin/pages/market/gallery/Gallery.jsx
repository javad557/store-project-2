import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getImages,
  deleteImage,
  setMainImage,

} from "../../../services/market/imageService.js";
import {
  showSuccess,
  showError,
  confirmDelete,
} from "../../../../utils/notifications.jsx";

function ProductGallery() {
  const { productId } = useParams();
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log("Sending request with productId:", productId);
        const response = await getImages(productId);
        console.log("API Response:", response.data);
        const rawImages = Array.isArray(response.data.images) ? response.data.images : [];
        setImages(rawImages);
        setProductName(response.data.product_name || "محصول بدون نام");
      } catch (error) {
        console.error("API Error:", error);
        setImages([]);
        setProductName("محصول بدون نام");
        showError("دریافت تصاویر محصول با خطا مواجه شد");
      }
    };
    fetchImages();
  }, [productId]);

  const handleDelete = async (imageId, imageName) => {
    const isConfirmed = await confirmDelete(imageName || "تصویر");
    if (isConfirmed) {
      try {
        const response = await deleteImage(imageId);
        setImages(images.filter((image) => image.id !== imageId));
        showSuccess(response.data.message || "تصویر با موفقیت حذف شد");
      } catch (error) {
        showError("حذف تصویر با خطا مواجه شد");
      }
    }
  };

  const handleSetMainImage = async (imageId, isMain) => {
    try {
      const response = await setMainImage(productId, imageId, isMain);
      setImages(
        images.map((image) =>
          image.id === imageId
            ? { ...image, is_main: isMain }
            : { ...image, is_main: 0 }
        )
      );
      showSuccess(response.data.message || `تصویر ${isMain ? "اصلی" : "غیراصلی"} شد`);
    } catch (error) {
      showError("تغییر وضعیت تصویر اصلی با خطا مواجه شد");
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>گالری محصول: {productName}</h5>
          </section>
          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to={`/admin/market/gallery/add/${productId}`}
             className="btn btn-success btn-sm">
              <i className="fa fa-plus"></i> افزودن عکس جدید
            </Link>
            <Link to="/admin/market/products" className="btn btn-info btn-sm">
              بازگشت
            </Link>
    
          </section>
          <section className="table-responsive">
            <table className="table table-striped table-hover h-150px">
              <thead>
                <tr>
                  <th>#</th>

                  <th>تصویر کالا</th>
                  <th>عکس اصلی</th>
 
                </tr>
              </thead>
              <tbody>
                {images.length > 0 ? (
                  images.map((image, index) => {
                    
                    return (
                      <tr key={image.id}>
                        <td>{index + 1}</td>

                        <td>
                          <img
                            src={`http://localhost:8000/storage/${image.image}`}
                            alt={image.name || "تصویر محصول"}
                            width="90"
                            height="90"
                          />
                        </td>
                        <td className="">
                          <input
                            type="checkbox"
                            checked={image.is_main === 1}
                            onChange={(e) =>
                              handleSetMainImage(image.id, e.target.checked ? 1 : 0)
                            }
                            className="me-2"
                          />
                        </td>
                        <td className="width-16-rem text-left">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(image.id, image.name)}
                          >
                            <i className="fa fa-trash-alt"></i> حذف
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4">تصویری یافت نشد</td>
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

export default ProductGallery;