import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProduct, saveVariants } from "../../../services/market/variantService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function VariantManagement() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [colors, setColors] = useState([{ id: 1, name: "" }]);
  const [features, setFeatures] = useState([{ id: 1, feature: "", values: [] }]);
  const [defaultVariantCount, setDefaultVariantCount] = useState(10);
  const [combinations, setCombinations] = useState([{ id: 1, selected: [] }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featureInputs, setFeatureInputs] = useState({});
  const [combinationInputs, setCombinationInputs] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewCombinations, setPreviewCombinations] = useState([]);
  const [previewCounts, setPreviewCounts] = useState({});
  const [previewPriceIncreases, setPreviewPriceIncreases] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(productId);
        setProductName(response.data.name || "محصول بدون نام");
      } catch (error) {
        setError("خطا در دریافت اطلاعات محصول");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const addColorField = () => {
    setColors([...colors, { id: colors.length + 1, name: "" }]);
  };

  const addFeatureField = () => {
    setFeatures([...features, { id: features.length + 1, feature: "", values: [] }]);
  };

  const addCombinationField = () => {
    setCombinations([...combinations, { id: combinations.length + 1, selected: [] }]);
  };

  const handleColorChange = (id, value) => {
    setColors(colors.map((color) => (color.id === id ? { ...color, name: value } : color)));
  };

  const handleFeatureChange = (id, field, value) => {
    setFeatures(
      features.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    );
  };

  const handleCombinationChange = (id, values) => {
    setCombinations(
      combinations.map((combination) =>
        combination.id === id ? { ...combination, selected: values } : combination
      )
    );
  };

  const handleFeatureInputChange = (id, value) => {
    setFeatureInputs({ ...featureInputs, [id]: value });
  };

  const handleCombinationInputChange = (id, value) => {
    setCombinationInputs({ ...combinationInputs, [id]: value });
  };

  const handleFeatureKeyPress = (id, e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const inputValue = featureInputs[id]?.trim();
      if (inputValue) {
        const newValues = [...features.find((f) => f.id === id).values, inputValue];
        handleFeatureChange(id, "values", newValues);
        setFeatureInputs({ ...featureInputs, [id]: "" });
      }
    }
  };

  const handleCombinationKeyPress = (id, e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const inputValue = combinationInputs[id]?.trim();
      if (inputValue) {
        const newValues = [...combinations.find((c) => c.id === id).selected, inputValue];
        handleCombinationChange(id, newValues);
        setCombinationInputs({ ...combinationInputs, [id]: "" });
      }
    }
  };

  const removeFeatureTag = (id, tag) => {
    const newValues = features
      .find((f) => f.id === id)
      .values.filter((value) => value !== tag);
    handleFeatureChange(id, "values", newValues);
  };

  const removeCombinationTag = (id, tag) => {
    const newValues = combinations
      .find((c) => c.id === id)
      .selected.filter((value) => value !== tag);
    handleCombinationChange(id, newValues);
  };

  const generateCombinations = (arrays) => {
    if (!arrays.length) return [[]];
    const result = [];
    const first = arrays[0];
    const rest = arrays.slice(1);

    const combinationsOfRest = generateCombinations(rest);
    for (const item of first) {
      for (const combination of combinationsOfRest) {
        result.push([item, ...combination]);
      }
    }
    return result;
  };

  const isForbiddenCombination = (combination, forbiddenCombinations) => {
    return forbiddenCombinations.some((forbidden) =>
      forbidden.selected.every((tag) => combination.includes(tag))
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const filteredColors = colors.filter((color) => color.name.trim() !== "");
    const filteredFeatures = features.filter(
      (feature) => feature.feature.trim() !== "" || feature.values.length > 0
    );
    const filteredCombinations = combinations.filter(
      (combination) => combination.selected.length > 0
    );

    const colorValues = filteredColors.map((color) => color.name);
    const featureValues = filteredFeatures.map((feature) => feature.values);
    const allArrays = [colorValues, ...featureValues].filter((arr) => arr.length > 0);
    const allCombinations = generateCombinations(allArrays);
    const allowedCombinations = allCombinations.filter(
      (combination) => !isForbiddenCombination(combination, filteredCombinations)
    );

    setPreviewCombinations(allowedCombinations);
    setPreviewCounts(
      allowedCombinations.reduce((acc, _, index) => {
        acc[index] = defaultVariantCount;
        return acc;
      }, {})
    );
    setPreviewPriceIncreases(
      allowedCombinations.reduce((acc, _, index) => {
        acc[index] = 0;
        return acc;
      }, {})
    );
    setShowPreview(true);
  };

  const handlePreviewInputChange = (rowIndex, colIndex, value) => {
    setPreviewCombinations((prev) =>
      prev.map((row, i) =>
        i === rowIndex ? row.map((val, j) => (j === colIndex ? value : val)) : row
      )
    );
  };

  const handlePreviewCountChange = (rowIndex, value) => {
    setPreviewCounts((prev) => ({
      ...prev,
      [rowIndex]: parseInt(value) || 0,
    }));
  };

  const handlePreviewPriceIncreaseChange = (rowIndex, value) => {
    setPreviewPriceIncreases((prev) => ({
      ...prev,
      [rowIndex]: parseInt(value) || 0,
    }));
  };

  const handleConfirm = async () => {
    try {
      const filteredFeatures = features.filter(
        (feature) => feature.feature.trim() !== "" || feature.values.length > 0
      );

      const payload = {
        combinations: previewCombinations.map((combo, index) => ({
          color: combo[0],
          attribute: filteredFeatures.reduce((acc, feature, i) => {
            acc[feature.feature || `ویژگی ${i + 1}`] = combo[i + 1];
            return acc;
          }, {}),
          value: previewCounts[index] || defaultVariantCount,
          price_increase: previewPriceIncreases[index] || 0,
        })),
        forbiddenCombinations: combinations
          .filter((combination) => combination.selected.length > 0)
          .map((c) => c.selected),
        action: "add",
      };

      console.log("Payload ارسالی برای افزودن:", payload); // برای دیباگ
      await saveVariants(productId, payload);
      showSuccess("واریانت‌ها با موفقیت ذخیره شدند");
      setShowPreview(false);
      navigate(`/admin/market/variants/${productId}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.join("، ") || "خطا در ذخیره واریانت‌ها";
      showError(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
    setPreviewCombinations([]);
    setPreviewCounts({});
    setPreviewPriceIncreases({});
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "آیا از حذف واریانت‌ها مطمئن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف کن!",
      cancelButtonText: "لغو",
    });

    if (result.isConfirmed) {
      try {
        const filteredColors = colors.filter((color) => color.name.trim() !== "");
        const filteredFeatures = features.filter(
          (feature) => feature.feature.trim() !== "" || feature.values.length > 0
        );
        const filteredCombinations = combinations.filter(
          (combination) => combination.selected.length > 0
        );

        const colorValues = filteredColors.map((color) => color.name);
        const featureValues = filteredFeatures.map((feature) => feature.values);
        const allArrays = [colorValues, ...featureValues].filter((arr) => arr.length > 0);
        const allCombinations = generateCombinations(allArrays);
        const allowedCombinations = allCombinations.filter(
          (combination) => !isForbiddenCombination(combination, filteredCombinations)
        );

        const deleteCombinations = allowedCombinations.map((combo) => ({
          color: combo[0],
          attribute: filteredFeatures.reduce((acc, feature, i) => {
            acc[feature.feature || `ویژگی ${i + 1}`] = combo[i + 1];
            return acc;
          }, {}),
        }));

        if (deleteCombinations.length === 0) {
          showError("هیچ ترکیبی برای حذف وجود ندارد. لطفاً رنگ‌ها و ویژگی‌ها را وارد کنید.");
          return;
        }

        const payload = {
          combinations: deleteCombinations,
          forbiddenCombinations: filteredCombinations.map((c) => c.selected),
          action: "delete",
        };

        console.log("Payload ارسالی برای حذف:", payload);
        await saveVariants(productId, payload);
        showSuccess("واریانت‌ها با موفقیت حذف شدند");
        setColors([{ id: 1, name: "" }]);
        setFeatures([{ id: 1, feature: "", values: [] }]);
        setCombinations([{ id: 1, selected: [] }]);
        setDefaultVariantCount(10);
        setFeatureInputs({});
        setCombinationInputs({});
        navigate(`/admin/market/variants/${productId}`);
      } catch (error) {
        const errorMessage =
          error.response?.data?.errors?.join("، ") || "خطا در حذف واریانت‌ها";
        showError(errorMessage);
      }
    }
  };

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .btn-green { background-color: #28a745; color: white; }
          .btn-blue { background-color: #007bff; color: white; }
          .btn-red { background-color: #dc3545; color: white; }
          .form-group { margin-bottom: 1rem; }
          .color-form-group { display: flex; gap: 10px; align-items: center; }
          .header-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
          .tags-input-container {
            border: 1px solid #ced4da;
            border-radius: 4px;
            padding: 6px;
            min-height: 38px;
            width: 100%;
            direction: rtl;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }
          .tags-input {
            border: none;
            outline: none;
            flex-grow: 1;
            padding: 2px 5px;
            font-size: 1rem;
            direction: rtl;
            min-width: 100px;
          }
          .tag {
            background-color: #007bff;
            color: white;
            padding: 2px 8px;
            margin: 2px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
          }
          .tag-remove {
            cursor: pointer;
            margin-left: 5px;
            font-weight: bold;
          }
          .tag-remove::before {
            content: "×";
            color: white;
          }
          .preview-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          .preview-table th, .preview-table td { border: 1px solid #ced4da; padding: 8px; text-align: center; }
          .preview-table th { background-color: #f8f9fa; }
          .preview-table input { width: 100%; padding: 4px; }
          .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
          .modal-content { background: white; padding: 20px; border-radius: 8px; max-width: 80%; max-height: 80%; overflow: auto; }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <div className="container">
            <div className="header-container">
              <div className="product-name">
                <span>{productName}</span>
              </div>
              <Link to={`/admin/market/variants/${productId}`} className="btn btn-blue btn-sm">
                بازگشت
              </Link>
            </div>

            {loading ? (
              <div className="text-center my-4">در حال بارگذاری...</div>
            ) : error ? (
              <div className="alert alert-danger text-center">{error}</div>
            ) : null}

            <form id="myform" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>رنگ‌ها</label>
                {colors.map((color) => (
                  <div key={color.id} className="color-form-group">
                    <input
                      type="text"
                      placeholder="نام رنگ را وارد کنید"
                      value={color.name}
                      onChange={(e) => handleColorChange(color.id, e.target.value)}
                      className="form-control"
                      style={{ width: "30%" }}
                    />
                  </div>
                ))}
                <button type="button" className="btn btn-green mt-2" onClick={addColorField}>
                  افزودن رنگ
                </button>
              </div>

              <div className="form-group">
                <label>ویژگی‌ها</label>
                {features.map((feature) => (
                  <div key={feature.id} className="mb-3">
                    <input
                      type="text"
                      placeholder="نام ویژگی را وارد کنید"
                      value={feature.feature}
                      onChange={(e) => handleFeatureChange(feature.id, "feature", e.target.value)}
                      className="form-control"
                      style={{ marginBottom: "10px" }}
                    />
                    <div className="tags-input-container">
                      {feature.values.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                          <span
                            className="tag-remove"
                            onClick={() => removeFeatureTag(feature.id, tag)}
                          />
                        </span>
                      ))}
                      <input
                        type="text"
                        className="tags-input"
                        placeholder="مقادیر ویژگی‌ها (با کاما یا Enter جدا کنید)"
                        value={featureInputs[feature.id] || ""}
                        onChange={(e) => handleFeatureInputChange(feature.id, e.target.value)}
                        onKeyPress={(e) => handleFeatureKeyPress(feature.id, e)}
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-green mt-2" onClick={addFeatureField}>
                  افزودن ویژگی
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="defaultVariant">تعداد پیش‌فرض هر واریانت</label>
                <input
                  type="number"
                  id="defaultVariant"
                  value={defaultVariantCount}
                  onChange={(e) => setDefaultVariantCount(parseInt(e.target.value) || 0)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>ترکیب‌های غیر مجاز</label>
                {combinations.map((combination) => (
                  <div key={combination.id} className="mb-3">
                    <div className="tags-input-container">
                      {combination.selected.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                          <span
                            className="tag-remove"
                            onClick={() => removeCombinationTag(combination.id, tag)}
                          />
                        </span>
                      ))}
                      <input
                        type="text"
                        className="tags-input"
                        placeholder="ترکیب‌های غیر مجاز (با کاما یا Enter جدا کنید)"
                        value={combinationInputs[combination.id] || ""}
                        onChange={(e) => handleCombinationInputChange(combination.id, e.target.value)}
                        onKeyPress={(e) => handleCombinationKeyPress(combination.id, e)}
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-green mt-2" onClick={addCombinationField}>
                  افزودن ترکیب جدید
                </button>
              </div>

              <div className="form-group">
                <button type="button" className="btn btn-red me-2" onClick={handleDelete}>
                  حذف
                </button>
                <button type="submit" className="btn btn-blue">
                  پیش‌نمایش
                </button>
              </div>
            </form>

            {showPreview && (
              <div className="modal">
                <div className="modal-content">
                  <h3>پیش‌نمایش واریانت‌ها</h3>
                  <table className="preview-table">
                    <thead>
                      <tr>
                        <th>رنگ</th>
                        {features
                          .filter((f) => f.feature.trim() !== "")
                          .map((feature) => (
                            <th key={feature.id}>{feature.feature || "ویژگی بدون نام"}</th>
                          ))}
                        <th>تعداد</th>
                        <th>افزایش قیمت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewCombinations.map((combo, rowIndex) => (
                        <tr key={rowIndex}>
                          {combo.map((value, colIndex) => (
                            <td key={colIndex}>
                              <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                  handlePreviewInputChange(rowIndex, colIndex, e.target.value)
                                }
                                className="form-control"
                              />
                            </td>
                          ))}
                          <td>
                            <input
                              type="number"
                              value={previewCounts[rowIndex] || defaultVariantCount}
                              onChange={(e) =>
                                handlePreviewCountChange(rowIndex, e.target.value)
                              }
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={previewPriceIncreases[rowIndex] || 0}
                              onChange={(e) =>
                                handlePreviewPriceIncreaseChange(rowIndex, e.target.value)
                              }
                              className="form-control"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="form-group mt-3">
                    <button className="btn btn-blue me-2" onClick={handleConfirm}>
                      تأیید
                    </button>
                    <button className="btn btn-red" onClick={handleCancel}>
                      انصراف
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>
    </section>
  );
}

export default VariantManagement;