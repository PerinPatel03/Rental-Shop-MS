import conf from "../conf/conf";

export class CustomerService {

    async getCustomers() {
        const res = await fetch(`${conf.baseUrl}/api/customers`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }

    async getCustomerById(id) {
        const res = await fetch(`${conf.baseUrl}/api/customers/${id}`);
        if(!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    async addCustomer(customerReqDto) {
        const res = await fetch(`${conf.baseUrl}/api/addcustomer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerReqDto),
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    async editCustomer(id, updatedCustomerReqDto) {
        const res = await fetch(`${conf.baseUrl}/api/updatecustomer/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCustomerReqDto),
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    // async searchCustomers(keyword) {
    //     const res = await fetch(`${conf.baseUrl}/api/customers/search?keyword=${keyword}`);
    //     if(!res.ok) {
    //         const errorText = await res.text();
    //         throw new Error(errorText || "Something went wrong");
    //         // throw new Error(await res.text() || "Something went wrong");
    //     }
    //     return await res.json();
    // }
}

const customerService = new CustomerService();

export default customerService
