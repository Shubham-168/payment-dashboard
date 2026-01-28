import type { Customer } from "../types/customer";


const STORAGE_KEY = "customers";


const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms));


export const customerApi = {
    async getAll(): Promise<Customer[]> {
        await sleep();
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    },


    async create(data: Customer) {
        await sleep();
        console.log('data in services', data);
        const list = await customerApi.getAll();
        console.log('all list data', list)
        list.push(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    },


    async update(id: string, data: Partial<Customer>) {
        await sleep();
        const list = await customerApi.getAll();
        const updated = list.map((c) => (c.id === id ? { ...c, ...data } : c));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },


    async delete(ids: string[]) {
        await sleep();
        const list = await customerApi.getAll();
        const filtered = list.filter((c) => !ids.includes(c.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },
};