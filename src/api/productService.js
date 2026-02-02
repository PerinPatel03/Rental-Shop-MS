import conf from "../conf/conf";

export class ProductService {

    async getActiveProducts() {
        const res = await fetch(`${conf.baseUrl}/api/products`);
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Something went wrong");
            // throw new Error(await res.text() || "Something went wrong");
        }
        return await res.json();
    }

    async getProductById(id) {
        const res = await fetch(`${conf.baseUrl}/api/products/${id}`);
        if(!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    async addProduct(productReqDto) {
        const res = await fetch(`${conf.baseUrl}/api/addproduct`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productReqDto),
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    async editProduct(id, updatedProductReqDto) {
        const res = await fetch(`${conf.baseUrl}/api/updateproduct/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProductReqDto),
        });
        if (!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    async softDeleteProduct(id) {
        const res = await fetch(`${conf.baseUrl}/api/softdeleteproduct/${id}`, {
            method: "DELETE",
        });
        if(!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.json();
    }

    // async searchProducts(keyword) {
    //     const res = await fetch(`${conf.baseUrl}/api/products/search?keyword=${keyword}`);
    //     if(!res.ok) {
    //         const errorText = await res.text();
    //         throw new Error(errorText || "Something went wrong");
    //         // throw new Error(await res.text() || "Something went wrong");
    //     }
    //     return await res.json();
    // }
}

const productService = new ProductService();

export default productService
