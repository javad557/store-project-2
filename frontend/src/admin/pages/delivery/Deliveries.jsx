import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { confirmDelete, showError, showSuccess } from "../../../utils/notifications";
import { deleteDelivery, getDeliveries } from "../../services/deliveryService";


function Deliveries (){

  const queryClient = useQueryClient();

   const { data: deliveries = [], isLoading, error,isError ,isSuccess} = useQuery({
     queryKey: ['deliveries'],
      queryFn: async () => {
           const response = await getDeliveries();
           return Array.isArray(response.data.data) ? response.data.data : [];
      },
     
       onError: (error) => {
      showError(error.response?.data?.error || 'دریافت روش‌های ارسال با خطا مواجه شد');
    },
   })

    if(isError){
      console.log('error');
       showError(error.response?.data?.error || 'دریافت روش‌های ارسال با خطا مواجه شد');
    }
    if(isSuccess){
      console.log('success');
    }


   const deleteMutation = useMutation({
       mutationFn: deleteDelivery,
       onSuccess: (response, deliveryId) => {
           // به‌روزرسانی کش
           queryClient.setQueryData(['deliveries'], (oldData) =>
             oldData.filter((delivery) => delivery.id !== deliveryId)
           );
           queryClient.invalidateQueries(['deliveries']); // بازخوانی داده‌ها
           showSuccess(response.data.message);
       },
       onError: (error) => {
         showError(error.response?.data?.error || 'حذف روش ارسال با خطا مواجه شد');
       },
     });


   const handleDelete = async (id,name)=>{
    const isConfirmed = await confirmDelete(name);
    if(isConfirmed){
      deleteMutation.mutate(id);
    }
   }

  return(
     <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت روش‌های ارسال</h5>
          </section>
          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/deliveries/add" className="btn btn-success btn-sm ms-auto">
              <i className="fa fa-plus"></i> افزودن روش ارسال جدید
            </Link>
          </section>
          {isLoading ? (
             <div className="text-center my-4">
              <p>در حال بارگذاری...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
            </div>
          ): error ? (
             <div className="text-center my-4 text-danger">
              خطایی رخ داده است. لطفاً دوباره تلاش کنید.
            </div>
          ):(
            <section className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نام روش ارسال</th>
                    <th>هزینه (تومان)</th>
                    <th>زمان ارسال</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.length > 0 ? (
                    deliveries.map((delivery, index) => (
                      <tr key={delivery.id}>
                        <td>{index + 1}</td>
                        <td>{delivery.name}</td>
                        <td>{delivery.amount}</td>
                        <td>{delivery.delivery_time}</td>
                        <td>
                          <Link
                            to={`/admin/deliveries/edit/${delivery.id}`}
                            className="btn btn-primary btn-sm me-2"
                          >
                            ویرایش
                            <i className="fa fa-edit ms-1"></i>
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(delivery.id, delivery.name)}
                          >
                            حذف
                            <i className="fa fa-trash ms-1"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ):(
                    <tr>
                      <td colSpan="5" className="text-center">
                        هیچ روش ارسالی وجود ندارد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}
        </section>
      </section>
    </section>
  )
}

export default Deliveries;
  
  
  
  
  
  
  
  // <section className="row">
    //   <section className="col-12">
    //     <section className="main-body-container">
    //       <section className="main-body-container-header">
    //         <h5>مدیریت روش‌های ارسال</h5>
    //       </section>
    //       <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
    //         <Link to="/admin/deliveries/add" className="btn btn-success btn-sm ms-auto">
    //           <i className="fa fa-plus"></i> افزودن روش ارسال جدید
    //         </Link>
    //       </section>
         
    //         <section className="table-responsive">
    //           <table className="table table-striped table-hover">
    //             <thead>
    //               <tr>
    //                 <th>#</th>
    //                 <th>نام روش ارسال</th>
    //                 <th>هزینه (تومان)</th>
    //                 <th>زمان ارسال</th>
    //                 <th>عملیات</th>
    //               </tr>
    //             </thead>
    //             <tbody>
                  
    //             </tbody>
    //           </table>
    //         </section>
    //     </section>
    //   </section>
    // </section>





//  <div className="text-center my-4">
//               <p>در حال بارگذاری...</p>
//               <div className="spinner-border" role="status">
//                 <span className="visually-hidden">در حال بارگذاری...</span>
//               </div>
//             </div>




//  <div className="text-center my-4 text-danger">
//               خطایی رخ داده است. لطفاً دوباره تلاش کنید.
//             </div>


{/* <tr>
                      <td colSpan="5" className="text-center">
                        هیچ روش ارسالی وجود ندارد.
                      </td>
                    </tr> */}
