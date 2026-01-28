import CustomerTable from "../components/table/CustomerTable";
import CustomerModal from "../components/modal/CustomerModal";


export default function PaymentHistory() {
    return (
        <>
            <h1 className="text-lg hidden md:block font-semibold mb-4">Payment History</h1>
            <CustomerTable />
            <CustomerModal />
        </>
    );
}   