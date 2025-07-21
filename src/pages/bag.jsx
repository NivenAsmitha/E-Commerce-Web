import ProductGrid from "../components/ProductGrid/ProductGrid";
import BagBanner from "../assets/website/bag.jpg";
export default function Bag({ handleAddToCart }) {
  return (
    <ProductGrid
      fetchUrl="http://localhost/kaizen-backend/bag_api.php"
      bannerImg={BagBanner}
      title="#Bag"
      subtitle="Our Premium Collection"
      handleAddToCart={handleAddToCart}
    />
  );
}
