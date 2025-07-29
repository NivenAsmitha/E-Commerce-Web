import ProductGrid from "../components/ProductGrid/ProductGrid";
import CapBanner from "../assets/website/cap2.jpg";

export default function Caps() {
  return (
    <ProductGrid
      fetchUrl="http://localhost/kaizen-backend/cap_api.php"
      bannerImg={CapBanner}
      title="#Caps"
      subtitle="Our Premium Collection"
    />
  );
}
