import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { db } from "../../firebase/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { Vortex } from "react-loader-spinner";
import Image from '../../Assets/images/profile.jpg'
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { setCartItems } from "../../redux/cartSlice";
import ScrollToTop from "../ScrollToTop/ScrollToTop";


export default function ProductDetails() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    const getProductData = async () => {
      setLoading(true);
      try {
        const productTemp = await getDoc(doc(db, "products", id));
        const productData = { ...productTemp.data(), id: productTemp.id };

        const reviewsCollectionRef = collection(doc(db, 'products', id), 'reviews');
        const reviewsSnapshot = await getDocs(reviewsCollectionRef);
        const reviewsData = reviewsSnapshot.docs.map(doc => doc.data());

        const totalRating = reviewsData.reduce((acc, comment) => acc + comment.rating, 0);
        const averageRating = reviewsData.length > 0 ? totalRating / reviewsData.length : 0;

        setProduct({ ...productData, rating: averageRating });
        setReviews(reviewsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProductData()
  }, [id]);

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Added to cart");
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  
  useEffect(() => {
    if (userId) {
      const saveCartToFirebase = async () => {
        try {
          const cartRef = doc(db, "carts", userId);
          await setDoc(cartRef, { items: cartItems });
        } catch (error) {
          console.error("Error saving cart to Firebase:", error);
        }
      };
      saveCartToFirebase();
    }
  }, [cartItems, userId]);

  useEffect(() => {
    if (userId) {
      const loadCartFromFirebase = async () => {
        try {
          const cartRef = doc(db, "carts", userId);
          const cartDoc = await getDoc(cartRef);
          if (cartDoc.exists()) {
            const cartData = cartDoc.data();
            dispatch(setCartItems(cartData.items || []));
          }
        } catch (error) {
          console.error("Error loading cart from Firebase:", error);
        }
      };
      loadCartFromFirebase();
    }
  }, [dispatch, userId]);

  // useEffect(() => {
  //   getProductData();
  // }, []);

  return (
    <>
    <ScrollToTop>
      {loading ? (
        <div className="flex justify-center items-center h-lvh">
          <Vortex
            height={150}
            width={150}
            radius={5}
            colors={["#E8E1DA", "#F3C0C7", "#AE6B77", "#4C1B1B", "#6C5A4B", "#F3C0C7"]}
            ariaLabel="ball-triangle-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row">
              {/* Image Slider */}
              <div className="w-full h-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
                <div id="controls-carousel" className="relative w-full" data-carousel="static">
                  <div className="relative md:h-96 lg:h-100 overflow-hidden rounded-lg">
                    <div className="duration-700 ease-in-out">
                      <img
                        src={product.image}
                        className="w-full h-full object-cover"
                        alt={product.name || 'product'}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Product Details */}
              <div className="w-full md:w-1/2 lg:w-2/3 p-4">
                <div className="text-xl font-bold mb-2">
                  {product.name}
                  <div className="">
                    {product.rating > 0 && (
                      <StarRatings
                        rating={product.rating || 0}
                        starRatedColor="orange"
                        numberOfStars={5}
                        name="rating"
                        starDimension="20px"
                        starSpacing="3px"
                      />
                    )}
                  </div>
                </div>
                <h4 className="text-md text-gray-600 mb-4">{product.description}</h4>
                <h4><b>Flowers Details :</b></h4>
                <ul>
                  <li>Name :<b>{product.type}</b></li>
                  <li>Country :<b>{product.country}</b></li>
                  <li>Color :<b>{product.colour}</b></li>
                </ul>
                <h4 className="text-lg font-semibold text-yellow-600 mb-4">{product.price} EGP</h4>
                <button
                  onClick={() => addCart(product)}
                  className="bg-deep-burgundy text-white rounded-tr-full rounded-bl-full py-2 px-8 mt-4 hover:bg-dusty-mauve transition"
                >
                  Add to cart
                </button>
              </div>
            </div>
            {/* Comments */}
            <div className="mt-8 bg-pale-grayish p-4 rounded-lg">
              <h2 className="font-bold text-2xl mb-4 p-2 rounded-lg">Reviews</h2>
              {reviews.map((review, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-center mb-3">
                    <img
                      className="w-12 h-12 rounded-full mr-4"
                      src={Image}
                      alt="User Avatar"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{review.userName}</h3>
                      <StarRatings
                        rating={review.rating}
                        numberOfStars={5}
                        starDimension="20px"
                        starSpacing="2px"
                        starRatedColor="#fc0"
                      />
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <hr className="border-t border-deep-burgundy" />
                </div>
              ))}
            </div>
          </div>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
        </>
      )}
      </ScrollToTop>
    </>
  );
}
