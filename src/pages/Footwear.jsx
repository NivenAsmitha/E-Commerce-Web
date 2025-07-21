import ProductGrid from "../components/ProductGrid/ProductGrid";
import FootwearBanner from "../assets/website/footwear banner.jpg";
export default function Footwear({ handleAddToCart }) {
  return (
    <ProductGrid
      fetchUrl="http://localhost/kaizen-backend/footwear_api.php"
      bannerImg={FootwearBanner}
      title="#Footwear"
      subtitle="Our Premium Collection"
      handleAddToCart={handleAddToCart}
    />
  );
}
