import { useEffect, useState } from "react";
import Checkbox from "react-custom-checkbox";
import { exportToCSV } from "../utils/exportCSV";


function Inventory ({ searchQuery }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [link, setLink] = useState('');
    const [lowStockChecked, setLowStockChecked] = useState(false);
    const [draftProduct, setDraftProduct] = useState(false);


    const LOW_STOCK_THRESHOLD = 3; // Consider products with stock below 5 as low stock
    const baseUrl = '/admin/api/2024-07/products.json?limit=250'; // Adjust limit based on your needs
    
    useEffect(() => {
      const getProducts = async () => {
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
    
          const products = await resp.json();
          setData(products.products);
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
    
      getProducts();
    }, []); // Empty dependency array ensures this runs only once
    
       
    const product_inventory = data;

    // Filter products based on both the search query and low stock checkbox
    const filteredProducts = product_inventory.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const isActive = item.status === "active";
        const isDraft = item.status === "draft";
        const hasLowStock = item.variants.every(variant => variant.inventory_quantity < LOW_STOCK_THRESHOLD);
        
        if (draftProduct && lowStockChecked) {
            return matchesQuery && isDraft && hasLowStock;
        }
        else if (draftProduct) {
            return matchesQuery && isDraft && hasLowStock;
        }
        else if (lowStockChecked) {
            return matchesQuery && hasLowStock && isActive;
        }
    
        return matchesQuery && isActive;
    }).map((item, index) => ({
        ...item,
        id: index + 1 // Start id from 1 and increment by 1
    }));

    const handleExport = () => {
        // Convert filtered products to a format suitable for CSV
        const exportData = filteredProducts.map((product) => ({
            ID: product.id,
            Title: product.title,
            // Vraint: product.variants.map((varr) => `${varr.option1} -- ${varr.option2} -- ${varr.option3}`).join(", "),
            Size: product.variants.map((varr) => varr.option1).join(", "),
            Color: product.variants.map((varr) => varr.option2).join(", "),
            Material: product.variants.map((varr) => varr.option3).join(", "),
            Stock: product.variants.map((varr) => varr.inventory_quantity).join(", "),
            Status: product.status
        }));
    
        exportToCSV(exportData, "inventory.csv");
      };
      

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
    
            const products = await resp.json();
            setData(prevData => [...prevData, ...products.products]);
            
    
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


    return (
        <div className="main_container">
            <h2 className='heading'>Product Details</h2>

            <div className="container_block">
                <Checkbox
                    name="my-input"
                    checked={lowStockChecked}
                    borderColor="#D7C629"
                    style={{ cursor: "pointer" }}
                    labelStyle={{ marginLeft: 5, userSelect: "none", fontSize: "20px", lineHeight: "26px", color: "#ffffff", fontWeight: "600" }}
                    label="Low Stock Products (<3)"
                    onChange={() => setLowStockChecked(!lowStockChecked)}
                />
                <Checkbox
                    name="my-input"
                    checked={draftProduct}
                    borderColor="#D7C629"
                    style={{ cursor: "pointer" }}
                    labelStyle={{ marginLeft: 5, userSelect: "none", fontSize: "20px", lineHeight: "26px", color: "#ffffff", fontWeight: "600" }}
                    label="Show Draft Products"
                    onChange={() => setDraftProduct(!draftProduct)}
                />
                <h4 className="total">Total Products: {filteredProducts.length}</h4>

                <button className="buttons" onClick={handleExport}>Export Customers</button>
            </div>

                    <div className="table_data" style={{maxHeight: '750px', height: 'auto'}}>
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
                                {filteredProducts.map((item)=>(
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
                
                    {product_inventory.length >= 250 && link && (
                        <div className="load_more">
                            <button className="buttons" onClick={fetchNextPage}>Load More</button>
                        </div>
                    )}
        </div>
    )
}

export default Inventory;



// search thru product title

// access token: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
// api key: aec14829c6068d3c7209b0fb1c99cfa1
// api secret: ec53dbafa6a84fc722a14565b63e397e
// https://pakt-shirts.myshopify.com/

// https://aec14829c6068d3c7209b0fb1c99cfa1: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@pakt-shirts.myshopify.com/admin/api/2024-07/products.json 
// https://pakt-shirts.myshopify.com/admin/api/2024-07/products.json?limit=250&page_info=eyJsYXN0X2lkIjo4MjQxNDA2NzM4NTgyLCJsYXN0X3ZhbHVlIjoiVmFudHJhIExUIFJBMTgiLCJkaXJlY3Rpb24iOiJuZXh0In0