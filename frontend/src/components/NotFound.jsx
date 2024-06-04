import { Link } from 'react-router-dom';
import Notfound from '../assets/images/404.jpg';

export default function NotFound() {
    return (
        <div className="flex flex-col justify-start items-center m-2 mt-12 max-w-screen-lg mx-auto">
            <div className="w-1/2 h-auto bg-green-600 p-4 rounded-xl m-2 mb-6">
                <img src={Notfound} alt="Not Found" className="w-full h-full rounded-md" />
            </div>
            <div className="bg-custom-green mt-2 p-4 rounded-xl text-md md:text-xl font-semibold">
                <Link to="/">
                    <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
                        Go to Home
                    </button>
                </Link>
            </div>
        </div>
    );
}
