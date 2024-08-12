import shopify from 'app/shopify.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { IndexTable, ButtonGroup, Button } from '@shopify/polaris';
import { useState } from 'react';

export async function loader({ request }) {
  const { admin, session } = await shopify.authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session , limit:200});
  
  return json(data);
}

export default function rest() {
  const { data } = useLoaderData();
  console.log(data)
  const itemsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const rowMarkup = currentItems.map(
    (
      { image, id, title},
      index,
    ) => (
      <IndexTable.Row id={id} key={id} position={index} >
        <IndexTable.Cell> <img height={"40px"} src={image.src} /> </IndexTable.Cell>
        <IndexTable.Cell>{id}</IndexTable.Cell>
        <IndexTable.Cell> {title} </IndexTable.Cell>
      
      </IndexTable.Row>
    ),
  );
  return (
    <>
      <IndexTable
        itemCount={data.length}
        headings={[
          { title: 'Image' },
          { title: 'Id' },
          { title: 'Title' },
        ]}
        selectable={false}
      >
        {rowMarkup}
      </IndexTable>

      <div className='polaris-btn'>
          <ButtonGroup segmented>
            <Button primary onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              Previous Page
            </Button >
            <span className='space-page'>{currentPage} </span><span> / </span> <span className='space-page'>{totalPages}</span>
            <Button primary onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next Page
            </Button>
          </ButtonGroup>
        </div>
    </>
  )
}