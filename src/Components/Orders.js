import { useEffect, useState } from "react";
import { exportToCSV } from "../utils/exportCSV";


function Orders ({searchQuery}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [link, setLink] = useState('');

    const baseUrl = '/admin/api/2024-07/orders.json?status=any'; // Base URL for requests

    useEffect(() => {
        const getOrders = async () => {
          try {
            const resp = await fetch(baseUrl, {
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
            setData(orders.orders);
            setLoading(false);
      
            const linkHeader = resp.headers.get('Link');
            if (linkHeader) {
              const nextLinkMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
              if (nextLinkMatch && nextLinkMatch[1]) {
                setLink(nextLinkMatch[1]);
              }
            }
          } catch (error) {
            setError(error);
            setLoading(false);
          }
        };
      
        getOrders();
      }, []); // Empty dependency array ensures this runs only once
      
      const fetchNextPage = async () => {
          if (!link) return;
      
          try {
              // Strip out the domain to ensure it goes through the proxy
              const relativeLink = link.replace('https://pakt-shirts.myshopify.com', '');
      
              const resp = await fetch(relativeLink, {
                  method: 'GET',
                  headers: {
                      'X-Shopify-Access-Token': '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',
                      'Content-Type': 'application/json'
                  }
              });
      
              if (!resp.ok) {
                  throw new Error(`HTTP error! status: ${resp.status}, statusText: ${resp.statusText}`);
              }
      
              const orders = await resp.json();
              setData(prevData => [...prevData, ...orders.orders]);
              
      
              // Handle pagination link for the next page
              const linkHeader = resp.headers.get('Link');
              if (linkHeader) {
                  const nextLinkMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
                  if (nextLinkMatch && nextLinkMatch[1]) {
                      setLink(nextLinkMatch[1].replace('https://pakt-shirts.myshopify.com', ''));
                  } else {
                      setLink(null); // No more pages
                  }
              }
      
          } catch (error) {
              console.error("Fetch error:", error.message);
              setError(error);
          }
      };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const order_list = data

    const filteredOrders = order_list.filter(item => {
        const firstName = item.customer.first_name;
        const lastName = item.customer.last_name;
        const orderNumber = item.order_number
        
        
        // Combine first and last name into a single string
        const fullName = `${firstName} ${lastName}`;
        const matchesQuery = fullName.toLowerCase().includes(searchQuery.toLowerCase()) || orderNumber.toString().includes(searchQuery);
    
        return matchesQuery;
    }).map((item, index) => ({
        ...item,
        index_id: index + 1 // Start id from 1 and increment by 1
    }));

    const handleExport = () => {
        // Convert filtered products to a format suitable for CSV
        const exportData = filteredOrders.map(order => ({
            ID: order.index_id,
            Order_Id: order.id,
            Order_Number: order.order_number,
            Customer_Name: `${order.customer.first_name} ${order.customer.last_name}`,
            Email: order.contact_email,
            Confiremed: order.confirmed.toString(),
            Price: order.current_total_price,
            Disocunt: order.current_total_discounts,
            Finanicial_Status: order.financial_status,
            Fulfillment_Status: order.fulfillment_status,
            Created_At: order.created_at,
            Closed_At: order.closed_at,
            Cancel_Reason: order.cancel_reason,
            Cancel_At: order.cancelled_at
          }));
    
        exportToCSV(exportData, "orders.csv");
      };

    return (
        <>
            <div className="main_container orders">
                <h2 className='heading'>Order Details</h2>
                
            <div className="container_block">
                <h4 className="total">Total Orders: {order_list.length}</h4>
                <button className="buttons" onClick={handleExport}>Export Orders</button>
            </div>

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
                        {filteredOrders.map((order)=>(
                            <tr className='body_row' key={order.index_id}>
                                <td className='index' data-label="index">{order?.index_id}</td>
                                <td className='details' data-label="order_id">{order?.id}</td>
                                <td className='details' data-label="order_number">{order?.order_number ? order?.order_number  : "N.A"}</td>
                                <td className='details' data-label="customer_name"> {order.customer.first_name ? order.customer.first_name : "N.A"} {order.customer.last_name ? order.customer.last_name : "N.A"} </td>
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

                    
            {order_list.length >= 250 && link && (
                <div className="load_more">
                    <button className="buttons" onClick={fetchNextPage}>Load More</button>
                </div>
            )}
            </div>
        </>
    )
}

export default Orders;

// search thru order number and customer name