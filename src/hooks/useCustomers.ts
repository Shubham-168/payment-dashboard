import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "../services/customerApi";
import type{ Customer } from "../types/customer";


export const useCustomers = () =>
useQuery({ queryKey: ["customers"], queryFn: customerApi.getAll });


export const useCreateCustomer = () => {
const qc = useQueryClient();
return useMutation({
mutationFn: customerApi.create,
onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
});
};


export const useUpdateCustomer = () => {
const qc = useQueryClient();
return useMutation({
mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
customerApi.update(id, data),
onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
});
};


export const useDeleteCustomer = () => {
const qc = useQueryClient();
return useMutation({
mutationFn: customerApi.delete,
onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
});
};