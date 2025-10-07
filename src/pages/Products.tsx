import { useParams } from "react-router";
import type { Product } from "../types/common";
import { useProducts } from "../queries/useProducts";
import Card from "../components/Card/Card";

const Products = () => {
  const { categorySlug } = useParams();

  const { data: products = [] } = useProducts({ categorySlug });

  return (
    <div className='main'>
      <ul className='product-list'>
        {products.map((product: Product) => (
          <li key={product.id}>
            <Card product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
