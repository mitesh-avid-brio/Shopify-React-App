import { useEffect, useState } from "react";


function Inventory () {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = '/admin/api/2024-07/products.json?limit=153'; // Adjust limit based on your needs

    // without nexpage url
    // useEffect(() => {
    //     const getProducts = async () => {
    //         try {
    //             let allProducts = [];
                
    //             const resp = await fetch(baseUrl, {
    //                 method: 'GET',
    //                 headers: {
    //                     'X-Shopify-Access-Token': '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',
    //                     'Content-Type': 'application/json'
    //                 }
    //             });

    //             if (!resp.ok) {
    //                 throw new Error(`HTTP error! status: ${resp.status}`);
    //             }

    //             const products = await resp.json();
    //             allProducts = allProducts.concat(products.products);

    //             setData(allProducts); // Set the combined product list
    //             setLoading(false);
    //         } 
    //         catch (error) {
    //             setError(error);
    //             setLoading(false);
    //         }
    //     };

    //     getProducts();
    // }, []); // Empty dependency array ensures this runs only once

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


                    // console.log("All", allProducts)
                    // Get the next page URL from the `link` header
                    const linkHeader = resp.headers.get('link');
                    if (linkHeader) {
                        const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
                        console.log
                        nextPageUrl = match ? match[2] : null;
                    } else {
                        nextPageUrl = null;
                    }
                        console.log("Next link", linkHeader)
                        console.log("Fetching link", nextPageUrl)
                    }


                setData(allProducts); // Set the combined product list
                setLoading(false);

            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        getProducts();
    }, []); // Empty dependency array ensures this runs only once
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Start id from 1 and increment by 1 for each product
    const product_inverntory = data.map((item, index) => ({
        ...item,
        id: index + 1 // Start id from 1 and increment by 1
    }));
    
    // console.log("Product Inventory", product_inverntory)
    return (
        <div className="main_container">
            <h2 className='heading'>Products Inventory</h2>
            <h4 className="total">Total Products: {product_inverntory.length}</h4>

                    <div className="table_data" style={{height: '800px'}}>
                        <table className="table">
                            <thead className='table_head'>
                                <tr>
                                    <th>Id</th>
                                    <th>Title</th>
                                    <th>Variants (Size -- Color -- Material)</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {product_inverntory.map((item)=>(
                                    <tr className='body_row' key={item.id}>
                                        <td className='index' data-label="index">{item?.id}</td>
                                        <td className='details' data-label="title">{item?.title ? item?.title : "N.A" }</td>
                                        <td className='details' data-label="variant">
                                            <ul>
                                                {item?.variants?.map((variant, index) => (
                                                    <li key={index}>
                                                         {variant.option1 ? variant.option1 : "N.A"} -- 
                                                         {variant.option2 ? variant.option2 : "N.A"} -- 
                                                         {variant.option3 ? variant.option3 : "N.A"}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className='details' data-label="variant_stock">
                                            <ul>
                                                {item?.variants?.map((variant, index) => (
                                                    <li key={index}>{variant.inventory_quantity}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className='details' data-label="variant">{item?.status}</td>
                                    </tr>)) }
                            </tbody>
                        </table>
                    </div>
        </div>
    )
}

export default Inventory;





// access token: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
// api key: aec14829c6068d3c7209b0fb1c99cfa1
// api secret: ec53dbafa6a84fc722a14565b63e397e
// https://pakt-shirts.myshopify.com/