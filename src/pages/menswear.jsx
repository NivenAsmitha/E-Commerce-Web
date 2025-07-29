import ProductGrid from "../components/ProductGrid/ProductGrid";
import MenswearBanner from "../assets/website/menswear.jpg";

export default function Menswear() {
  return (
    <ProductGrid
      fetchUrl="http://localhost/kaizen-backend/menswear_api.php"
      bannerImg={MenswearBanner}
      title="#Men's Wear"
      subtitle="Stylish Picks for Men"
    />
  );
}
