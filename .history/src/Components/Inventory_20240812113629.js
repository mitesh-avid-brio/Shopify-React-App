import { useEffect, useState } from "react";

function Inventory() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = 'https://pakt-shirts.myshopify.com/admin/api/2024-07/products.json';

    useEffect(() => {
        const getProducts = async () => {
            try {
                const resp = await fetch(url, {
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
                setData(products.products); // Assuming the API returns an array of products
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
                        </tr>
                    </thead>
                </table>
                <div className="tbody_container">
                    <table>
                        <tbody>
                            {data.map((item) => (
                                <tr className='body_row' key={item.id}>
                                    <td className='index' data-label="index">{item?.id}</td>
                                    <td className='details' data-label="title">{item?.title}</td>
                                    <td className='details' data-label="price">{item?.variants[0]?.price}</td>
                                    <td className='details' data-label="variant">{item?.variants.map(variant => variant.title).join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Inventory;
