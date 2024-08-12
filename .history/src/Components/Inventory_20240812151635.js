import { useEffect, useState } from "react";


function Inventory () {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = '/admin/api/2024-07/products.json?limit=16'; // Base URL for requests

    useEffect(() => {
        const getProducts = async () => {
            try {
                let allProducts = [];
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

                    const products = await resp.json();
                    allProducts = allProducts.concat(products.products);

                    // Get the next page URL from the `link` header
                    const linkHeader = resp.headers.get('link');
                    nextPageUrl = linkHeader
                        ? linkHeader.match(/<([^>]+)>;\s*rel="next"/)?.[1] || null
                        : null;
                }

                setData(allProducts); // Set the combined product list
                setLoading(false);
            } 
            catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        getProducts();
    }, []); // Empty dependency array ensures this runs only once

    console.log("Products", data)

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const product_inverntory= data
    
    // [
    //     {id:"01",title:"Bike",price:'50$',variants:"Blue"},
    //     {id:"02",title:"Car",price:'150$',variants:"Black"},
    // ]

    
    console.log("Product Inventory", product_inverntory)

    return (
        <div className="main_container">
            <h2 className='heading'>Shopify Panel</h2>

                    <div className="table_data">
                        <table className="table">
                            <thead className='table_head'>
                                <tr>
                                    <th>Id</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Variants</th>
                                    <th>Status</th>
                                    {/* <th>Action</th> */}
                                </tr>
                            </thead>
                        </table>

                        <div className="tbody_container">
                            <table>
                                <tbody>
                                    {product_inverntory.map((item)=>(
                                        <tr className='body_row' key={item.id}>
                                        <td className='index' data-label="index">{item?.id}</td>
                                        <td className='details' data-label="title">{item?.title}</td>
                                        <td className='details' data-label="price">{item?.price}</td>
                                        <td className='details' data-label="variant">
                                            {item?.variants?.map((variant) => (
                                                var.title
                                            ))}


                                        </td>
                                        <td className='details' data-label="variant">{item?.status}</td>
                                        {/* <td className='details' data-label="action"> </td> */}
                                    </tr>)) }
                                </tbody>
                            </table>
                        </div>
                    </div>
        </div>
    )
}

export default Inventory;





// access token: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
// api key: aec14829c6068d3c7209b0fb1c99cfa1
// api secret: ec53dbafa6a84fc722a14565b63e397e
// https://pakt-shirts.myshopify.com/