import { useEffect, useState } from "react";


function Orders () {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = '/admin/api/2024-07/orders.json?status=any'; // Base URL for requests

    useEffect(() => {
        const getOrders = async () => {
            try {
                let allOrders = [];
                let nextPageUrl = baseUrl;

                while (nextPageUrl) {
                    const resp = await fetch(nextPageUrl, {
                        method: 'GET',
                        headers: {
                            'X-Shopify-Access-Token': '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',
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!resp.ok) {
                        throw new Error(`HTTP error! status: ${resp.status}`);
                    }

                    const orders = await resp.json();
                    allOrders = allOrders.concat(orders.orders);

                    // Get the next page URL from the `link` header
                    const linkHeader = resp.headers.get('link');
                    nextPageUrl = linkHeader
                        ? linkHeader.match(/<([^>]+)>;\s*rel="next"/)?.[1] || null
                        : null;
                }

                setData(allOrders); // Set the combined product list
                setLoading(false);
            } 
            catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        getOrders();
    }, []); // Empty dependency array ensures this runs only once

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Start id from 1 and increment by 1 for each product
    const order_list = data.map((item, index) => ({
        ...item,
        index_id: index + 1 
    }));

    return (
        <>
            <div className="main_container">
                <h2 className='heading'>Order Details</h2>
                <h4 className="total">Total Orders: {order_list.length}</h4>

                        <div className="table_data">
                            <table className="table">
                                <thead className='table_head'>
                                    <tr>
                                        <th>Id</th>
                                        <th>Order Id</th>
                                        <th>Order Number</th>
                                        <th>Customer Name</th>
                                        <th>Contact Email</th>
                                        <th>Confirmed</th>
                                        <th>Price</th>
                                        <th>Discount</th>
                                        <th>Financial Status</th>
                                        <th>Fulfillment Status</th>
                                        <th>Created At</th>
                                        <th>Closed At</th>
                                        <th>Cancel Reason</th>
                                        <th>Cancel At</th>
                                        
                                    </tr>
                                </thead>

                                <tbody>
                                    {order_list.map((order)=>(
                                        <tr className='body_row' key={order.index_id}>
                                            <td className='index' data-label="index">{order?.index_id}</td>
                                            <td className='details' data-label="order_id">{order?.id}</td>
                                            <td className='details' data-label="order_number">{order?.order_number ? order?.order_number  : "N.A"}</td>
                                            <td className='details' data-label="customer_name"> {order?.customer.first_name} {order?.customer.last_name ? order?.first_name  : "N.A" ? order?.last_name  : "N.A"} </td>
                                            <td className='details' data-label="email">{order?.contact_email ? order?.contact_email  : "N.A"}</td>
                                            <td className='details' data-label="confirm">{order?.confirmed ? order?.confirmed.toString()  : "N.A"}</td>
                                            <td className='details' data-label="price">{order?.current_total_price ? order?.current_total_price  : "N.A"}</td>
                                            <td className='details' data-label="discount">{order?.current_total_discounts ? order?.current_total_discounts  : "N.A"}</td>
                                            <td className='details' data-label="finanicial status">{order?.financial_status ? order?.financial_status  : "N.A"}</td>
                                            <td className='details' data-label="fulfillment status">{order?.fulfillment_status ? order?.fulfillment_status  : "N.A"}</td>
                                            <td className='details' data-label="created_at">{order?.created_at ? order?.created_at  : "N.A"}</td>
                                            <td className='details' data-label="closed_at">{order?.closed_at ? order?.closed_at  : "N.A"}</td>
                                            <td className='details' data-label="cancel">{order?.cancel_reason ? order?.cancel_reason  : "N.A"}</td>
                                            <td className='details' data-label="cancel_at">{order?.cancelled_at ? order?.cancelled_at  : "N.A"}</td>
                                            
                                        </tr>)) }
                                </tbody>
                            </table>
                        </div>
            </div>
        </>
    )
}

export default Orders;





// access token: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
// api key: aec14829c6068d3c7209b0fb1c99cfa1
// api secret: ec53dbafa6a84fc722a14565b63e397e
// https://pakt-shirts.myshopify.com/