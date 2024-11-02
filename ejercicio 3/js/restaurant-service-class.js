import { Http } from './http.js';
import { SERVER } from './constants.js';

export class RestaurantsService{
    #http;
    constructor(){
        this.#http = new Http();
    }

    async getAll(){
        const resp = await this.#http.get(`${SERVER}/restaurants`);
        return resp.restaurants;
    }

    async post(restaurant){
        const resp = await this.#http.post(`${SERVER}/restaurants`, restaurant);
        return resp.restaurant;
    }

    delete(id){
        return this.#http.delete(`${SERVER}/restaurants/${id}`);
    }
}