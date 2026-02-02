import conf from "../conf/conf";

export class PaymentService {

    async findPaymentsByBookingId(bookingId) {
        const res = await fetch(`${conf.baseUrl}/api/bookings/${bookingId}/payments`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }

    async savePayment(paymentReqDto) {
        const res = await fetch(`${conf.baseUrl}/api/bookings/savepayment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentReqDto),
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json(); 
    }

    async searchPayments(params) {
        const query = new URLSearchParams();

        if(params.flow) query.append("flow", params.flow);
        if(params.type) query.append("type", params.type);
        if(params.fromDate) query.append("fromdate", params.fromDate);
        if(params.toDate) query.append("todate", params.toDate);

        if(params.page !== undefined) query.append("page", params.page);
        if(params.size !== undefined) query.append("size", params.size);
        
        const res = await fetch(`${conf.baseUrl}/api/payments?${query.toString()}`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }

    // async sumByBookingIdAndFlow(bookingId, paymentFlow) {
    //     const res = await fetch(`${conf.baseUrl}/api/bookings/${bookingId}/sumbyif?paymentflow=${paymentFlow}`);
    //     if(!res.ok) {
    //         const errorText = await res.text();
    //         throw new Error(errorText || "Something went wrong");
    //         // throw new Error(await res.text() || "Something went wrong");
    //     }
    //     return await res.json();
    // }

    // async sumByBookingIdAndFlowType(bookingId, paymentFlow, paymentType) {
    //     const res = await fetch(`${conf.baseUrl}/api/bookings/${bookingId}/sumbyifr?paymentflow=${paymentFlow}&paymenttype=${paymentType}`);
    //     if(!res.ok) {
    //         const errorText = await res.text();
    //         throw new Error(errorText || "Something went wrong");
    //         // throw new Error(await res.text() || "Something went wrong");
    //     }
    //     return await res.json();
    // }
}

const paymentService = new PaymentService();

export default paymentService
