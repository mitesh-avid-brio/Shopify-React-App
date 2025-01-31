import { useEffect, useState } from "react";
import { exportToCSV } from "../utils/exportCSV";


function Customers ({searchQuery}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [link, setLink] = useState('');

    const baseUrl = '/admin/api/2024-07/customers.json?limit=250'; // Base URL for requests

    useEffect(() => {
        const getCustomers = async () => {
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
      
            const customers = await resp.json();
            setData(customers.customers);
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
      
        getCustomers();
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
      
              const customers = await resp.json();
              setData(prevData => [...prevData, ...customers.customers]);
              
      
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

    const customer_list = data


    const filteredCustomers = customer_list.filter(item => {
        const firstName = item.first_name;
        const lastName = item.last_name;
        
        
        // Combine first and last name into a single string
        const fullName = `${firstName} ${lastName}`;
        const matchesQuery = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    
        return matchesQuery;
    }).map((item, index) => ({
        ...item,
        index_id: index + 1 // Start id from 1 and increment by 1
    }));

    const handleExport = () => {
        // Convert filtered products to a format suitable for CSV
        // const exportData = filteredCustomers;

        const exportData = filteredCustomers.map(customer => ({
            ID: customer.index_id,
            Customer_Id: customer.id,
            Customer_Name: `${customer.first_name} ${customer.last_name}`,
            Customer_Email: customer.email,
            Created_At: customer.created_at,
            Orders_Count: customer.orders_count,
            Total_Spent: customer.total_spent,
            Mob_No: customer.phone,
            Country: customer.addresses.map((cust) => cust.country).join(", "),
            City: customer.addresses.map((cust) => cust.city).join(", "),
            Address: customer.addresses.map((cust) => cust.address1).join(", ")
          }));
    
        exportToCSV(exportData, "customers.csv");
      };
    
    return (
        <div className="customers">
            <h2 className='heading'>Customers Details</h2>
            
            <div className="container_block">
                <h4 className="total">Total Customers: {customer_list.length}</h4>
                <button className="buttons" onClick={handleExport}>Export Customers</button>
            </div>

            <div className="table_data">
                <table className="table">
                    <thead className='table_head'>
                        <tr>
                            <th>Id</th>
                            <th>Customer Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Total Orders</th>
                            <th>Total Spent</th>
                            <th>Phone No</th>
                            <th>Country</th>
                            <th>City</th>
                            <th>Address</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCustomers.map((customer)=>(
                            <tr className='body_row' key={customer.index_id}>
                                <td className='index' data-label="index">{customer?.index_id}</td>
                                <td className='details' data-label="customer_id">{customer?.id ? customer?.id  : "N.A"}</td>
                                <td className='details' data-label="first_name">{customer?.first_name ? customer?.first_name  : "N.A"} {customer?.last_name ? customer?.last_name  : "N.A"}</td>
                                <td className='details' data-label="email">{customer?.email ? customer?.email  : "N.A"}</td>
                                <td className='details' data-label="created_at">{customer?.created_at ? customer?.created_at  : "N.A"}</td>
                                <td className='details' data-label="orders_count">{customer?.orders_count ? customer?.orders_count  : "N.A"}</td>
                                <td className='details' data-label="total_spent">{customer?.total_spent ? customer?.total_spent  : "N.A"}</td>
                                <td className='details' data-label="phone">{customer?.phone ? customer?.phone  : "N.A"}</td>

                                <td className='details' data-label="country">
                                    {customer?.addresses.map((cust) => (
                                            <span>{cust.country}</span>
                                    ))}
                                </td>
                                <td className='details' data-label="city">
                                    {customer?.addresses.map((cust) => (
                                        <span>{cust.city}</span>
                                    ))}
                                </td>
                                <td className='details' data-label="address1">
                                    {customer?.addresses.map((cust) => (
                                        <span>{cust.address1}</span>
                                    ))}
                                </td>
                            </tr>)) }
                    </tbody>
                </table>
            </div>

            {customer_list.length >= 250 && link && (
                <div className="load_more">
                    <button className="buttons" onClick={fetchNextPage}>Load More</button>
                </div>
            )}
        </div>
    )
}

export default Customers;


// search thru customer name