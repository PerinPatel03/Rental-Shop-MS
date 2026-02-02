import conf from "../conf/conf";

export class ProductImageService {

    // async getImageUrl(id) {
    //     const res = await fetch(`${conf.baseUrl}/api/products/${id}/getimageurl`);
    //     if(!res.ok) {
    //         const errorBody = await res.json();
    //         throw errorBody;
    //     }
    //     return await res.text(); // image URL
    // }

    async uploadImage(id, file) {
        const formdata = new FormData();
        formdata.append("file", file);

        const res = await fetch(`${conf.baseUrl}/api/products/${id}/uploadimage`, {
            method: "POST",
            body: formdata
        });
        if(!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.text(); // image URL
    }

    async updateImage(id, file) {
        const formdata = new FormData();
        formdata.append("file", file);

        const res = await fetch(`${conf.baseUrl}/api/products/${id}/updateimage`, {
            method: "PUT",
            body: formdata
        });
        if(!res.ok) {
            const errorBody = await res.json();
            throw errorBody;
        }
        return await res.text(); // image URL
    }

    // async deleteImage(id) {
    //     const res = await fetch(`${conf.baseUrl}/api/products/${id}/deleteimage`, {
    //         method: "DELETE"
    //     });
    //     if(!res.ok) {
    //         const errorBody = await res.json();
    //         throw errorBody;
    //     }
    //     return await res.text();
    // }
}

const productImageService = new ProductImageService()

export default productImageService
