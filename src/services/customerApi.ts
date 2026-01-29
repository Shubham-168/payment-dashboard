import type { Customer } from "../types/customer";
import { v4 as uuid } from "uuid";

const STORAGE_KEY = "customers";

const sleep = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export interface CustomerListParams {
  search?: string;
  pageIndex: number;
  pageSize: number;
}

export interface CustomerListResponse {
  data: Customer[];
  total: number;
}

/* ------------------ Dummy Seed Data ------------------ */

const dummyCustomers: Customer[] = Array.from({ length: 10 }).map((_, i) => ({
  id: uuid(),
  name: `Customer ${i + 1}`,
  description: `Sample description ${i + 1}`,
  status: ["Open", "Paid", "Due", "Inactive"][i % 4] as any,
  rate: 50 + i * 5,
  balance: 1000 - i * 100,
  deposit: 100 + i * 10,
}));

/* ------------------ Init Storage ------------------ */

function initStorage() {
  const existing = localStorage.getItem(STORAGE_KEY);

  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyCustomers));
    return dummyCustomers;
  }

  try {
    const parsed = JSON.parse(existing);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyCustomers));
      return dummyCustomers;
    }
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyCustomers));
    return dummyCustomers;
  }
}

/* ------------------ API ------------------ */

export const customerApi = {
  async getAll(): Promise<Customer[]> {
    await sleep();
    return initStorage();
  },

  async list(params: CustomerListParams): Promise<CustomerListResponse> {
    const { search = "", pageIndex, pageSize } = params;

    const all = await this.getAll();
    const query = search.trim().toLowerCase();

    const filtered = query
      ? all.filter((c) => {
          const values = [
            c.name,
            c.description,
            c.status,
            c.rate,
            c.balance,
            c.deposit,
          ];

          return values.some((v) =>
            String(v).toLowerCase().includes(query)
          );
        })
      : all;

    const total = filtered.length;
    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return {
      data: filtered.slice(start, end),
      total,
    };
  },

  async create(data: Customer): Promise<void> {
    await sleep();
    const list = await this.getAll();
    list.unshift(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  async update(id: string, data: Partial<Customer>): Promise<void> {
    await sleep();
    const list = await this.getAll();
    const updated = list.map((c) =>
      c.id === id ? { ...c, ...data } : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  async delete(ids: string[]): Promise<void> {
    await sleep();
    const list = await this.getAll();
    const filtered = list.filter((c) => !ids.includes(c.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};





// import type { Customer } from "../types/customer";

// const STORAGE_KEY = "customers";

// const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// export interface CustomerListParams {
//     search?: string;
//     pageIndex: number;
//     pageSize: number;
// }

// export interface CustomerListResponse {
//     data: Customer[];
//     total: number;
// }

// export const customerApi = {
   
//     async getAll(): Promise<Customer[]> {
//         await sleep();
//         return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
//     },

    
//     async list(params: CustomerListParams): Promise<CustomerListResponse> {
//         const { search = "", pageIndex, pageSize } = params;

//         const all = await customerApi.getAll();
//         const query = search.trim().toLowerCase();

//         const filtered = query
//             ? all.filter((c) => {
//                   const haystacks: (string | number)[] = [
//                       c.name,
//                       c.description,
//                       c.status,
//                       c.rate,
//                       c.balance,
//                       c.deposit,
//                   ];

//                   return haystacks.some((value) =>
//                       String(value).toLowerCase().includes(query)
//                   );
//               })
//             : all;

//         const total = filtered.length;
//         const start = pageIndex * pageSize;
//         const end = start + pageSize;
//         const page = filtered.slice(start, end);

//         return { data: page, total };
//     },

//     async create(data: Customer): Promise<void> {
//         await sleep();
//         const list = await customerApi.getAll();
//         list.unshift(data);
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
//     },

//     async update(id: string, data: Partial<Customer>): Promise<void> {
//         await sleep();
//         const list = await customerApi.getAll();
//         const updated = list.map((c) => (c.id === id ? { ...c, ...data } : c));
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//     },

//     async delete(ids: string[]): Promise<void> {
//         await sleep();
//         const list = await customerApi.getAll();
//         const filtered = list.filter((c) => !ids.includes(c.id));
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
//     },
// };