import conf from "../conf/conf";

export class BookingService {

    async isProductAvailable(id, startDate, endDate) {
        const res = await fetch(`${conf.baseUrl}/api/products/${id}/checkavailability?startdate=${startDate}&enddate=${endDate}`);
        if(!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    // async getProductBookings(id) {
    //     const res = await fetch(`${conf.baseUrl}/api/products/${id}/bookings`);
    //     if(!res.ok) {
    //         const errorText = await res.text();
    //         throw new Error(errorText || "Something went wrong");
    //         // throw new Error(await res.text() || "Something went wrong");
    //     }
    //     return await res.json();
    // }

    async getBookings() {
        const res = await fetch(`${conf.baseUrl}/api/bookings`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }

    async getBookingById(bookingId) {
        const res = await fetch(`${conf.baseUrl}/api/bookings/${bookingId}`);
        if(!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    async getBookingList() {
        const res = await fetch(`${conf.baseUrl}/api/bookinglist`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }

    async addBooking(bookingReqDto) {
        const res = await fetch(`${conf.baseUrl}/api/addbookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingReqDto),
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json(); 
    }

    async updateBooking(bookingId, bookingUpdateReqDto) {
        const res = await fetch(`${conf.baseUrl}/api/bookings/${bookingId}/updatebooking`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingUpdateReqDto),
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json(); 
    }

    async pickupBookedProduct(bookingId) {
        const res = await fetch(`${conf.baseUrl}/api/bookings/${bookingId}/pickupproduct`, {
            method: "POST",
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json(); 
    }

    async returnBookedProduct(bookingId, bookingReturnReqDto) {
        const res = await fetch(`${conf.baseUrl}/api/bookings/${bookingId}/returnproduct`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingReturnReqDto),
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json(); 
    }
}

const bookingService = new BookingService();

export default bookingService
