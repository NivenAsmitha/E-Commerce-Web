import ProductGrid from "../components/ProductGrid/ProductGrid";
import WomenBanner from "../assets/website/womenbanner.jpg";
export default function Womenwear({ handleAddToCart }) {
  return (
    <ProductGrid
      fetchUrl="http://localhost/kaizen-backend/womenwear_api.php"
      bannerImg={WomenBanner}
      title="#Women's Wear"
      subtitle="Fashion for Every Occasion"
      handleAddToCart={handleAddToCart}
    />
  );
}
