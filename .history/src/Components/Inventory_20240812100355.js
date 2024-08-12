import { useEffect, useState } from "react";


function Inventory () {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://pakt-shirts.myshopify.com/admin/api/2024-07/products.json?limit=3',{
            method: "GET",
            headers:{
                "X-Shopify-Access-Token": "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",
                "content-type": "application/json",
            }
        })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
                if(data){
                    setData(data.results);
                    setLoading(false);
                }
            })
            .catch(error => {
              setError(error);
              setLoading(false);
            });
    }, []);

    console.log("Products", data)

    const product_inverntory= [
        {id:"01",title:"Bike",price:'50$',variants:"Blue"},
        {id:"02",title:"Car",price:'150$',variants:"Black"},
    ]

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;
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
                                        <td className='details' data-label="variant">{item?.variants}</td>
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
// https://pakt-shirts.myshopify.com/