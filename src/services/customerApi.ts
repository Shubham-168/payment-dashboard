import type { Customer } from "../types/customer";

const STORAGE_KEY = "customers";

const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export interface CustomerListParams {
    search?: string;
    pageIndex: number;
    pageSize: number;
}

export interface CustomerListResponse {
    data: Customer[];
    total: number;
}

export const customerApi = {
    /**
     * Returns the full, unfiltered list of customers.
     * Used internally by mutations and list().
     */
    async getAll(): Promise<Customer[]> {
        await sleep();
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    },

    /**
     * Client-side filtered + paginated list.
     */
    async list(params: CustomerListParams): Promise<CustomerListResponse> {
        const { search = "", pageIndex, pageSize } = params;

        const all = await customerApi.getAll();
        const query = search.trim().toLowerCase();

        const filtered = query
            ? all.filter((c) => {
                  const haystacks: (string | number)[] = [
                      c.name,
                      c.description,
                      c.status,
                      c.rate,
                      c.balance,
                      c.deposit,
                  ];

                  return haystacks.some((value) =>
                      String(value).toLowerCase().includes(query)
                  );
              })
            : all;

        const total = filtered.length;
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        const page = filtered.slice(start, end);

        return { data: page, total };
    },

    async create(data: Customer): Promise<void> {
        await sleep();
        const list = await customerApi.getAll();
        list.push(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    },

    async update(id: string, data: Partial<Customer>): Promise<void> {
        await sleep();
        const list = await customerApi.getAll();
        const updated = list.map((c) => (c.id === id ? { ...c, ...data } : c));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    async delete(ids: string[]): Promise<void> {
        await sleep();
        const list = await customerApi.getAll();
        const filtered = list.filter((c) => !ids.includes(c.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },
};