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

    async add(restaurante){
        const resp = await this.#http.post(`${SERVER}/restaurants`, restaurante);
        return resp.restaurant;
    }

    delete(id){
        return this.#http.delete(`${SERVER}/restaurants/${id}`);
    }
}