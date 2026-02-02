import React, { useEffect, useState } from 'react'
import bookingService from '../../api/bookingService'
import { BookingForm } from '../../component/index'
import { useNavigate, useParams } from 'react-router'

function EditBooking() {
  const {id} = useParams();
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      bookingService.getBookingById(id)
      .then((res) => {
        if (res) 
          setBooking(res);
         else 
          navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });

    } else 
        navigate("/");
    
  }, [id, navigate]);

  return booking ? (
    <div className='py-8'>
      <BookingForm booking={booking} />
    </div>
  ) : null
}

export default EditBooking
