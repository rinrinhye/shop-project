import Card from "../components/Card/Card";
import CardSkeleton from "../components/Card/CardSkeleton";
import { useProducts } from "../queries/useProducts";
import type { Product } from "../types/common";

const Home = () => {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className='main'>
        <ul className='product-list'>
          {Array.from({ length: 16 }).map((_, i) => (
            <li key={i}>
              <CardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    );
  }

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

export default Home;
