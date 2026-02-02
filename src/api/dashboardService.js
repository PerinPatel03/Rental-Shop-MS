import conf from "../conf/conf";

export class DashboardService {

    async getSummary() {
        const res = await fetch(`${conf.baseUrl}/api/dashboard/summary`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }

    async getActiveBookings() {
        const res = await fetch(`${conf.baseUrl}/api/dashboard/active-bookings`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }

    async getRecentPayments(limit = 5) {
        const res = await fetch(`${conf.baseUrl}/api/dashboard/recent-payments?limit=${limit}`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }
}

const dashboardService = new DashboardService();

export default dashboardService
