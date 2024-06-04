import { Link } from "react-router-dom";
import Home1 from '../assets/images/home1.jpg';
import Home2 from '../assets/images/home2.jpg';

export default function Home() {
  return (
    <div className="m-4">
      <div className="container mx-auto px-4 py-8 bg-green-500 mt-8 rounded-xl">
        <Link to="/blog"><div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg overflow-hidden">
          <img src={Home2} alt="Placeholder Image 2" className="object-cover h-auto w-full rounded-xl" />
          <img src={Home1} alt="Placeholder Image 1" className="object-cover h-auto w-full rounded-xl" />
        </div></Link>
      </div>
    </div>
  );
}
