import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { db } from "../../firebase/firebase";
import { collection, doc, getDoc, getDocs , setDoc} from "firebase/firestore";
import { Vortex } from "react-loader-spinner";
import Image from '../../Assets/images/profile.jpg'
import {Helmet} from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { setCartItems } from "../../redux/cartSlice";

export default function ProductDetails() {
 
  //related to data fetching from the database--------------------------------------------------------------------------------------------------
  const [product, setProduct] = useState([]);
  const [loading, SetLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const { id } = useParams();

  const getProductData = async () => {
    SetLoading(true);
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      setProduct({...productDoc.data(), id : productDoc.id})
      console.log({...productDoc.data(), id : productDoc.id})
      const reviewsCollectionRef = collection(doc(db, 'products', id), 'reviews');
      const reviewsSnapshot = await getDocs(reviewsCollectionRef);
      const reviewsData = reviewsSnapshot.docs.map(doc => doc.data());
      setReviews(reviewsData);
      if (productDoc.exists()) {
        setProduct(productDoc.data(),productDoc.id);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    } finally {
      SetLoading(false);
    }
  };
  console.log(id)

  const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addCart = (item , id) => {
        // console.log(item)
        dispatch(addToCart(item ,id));
        toast.success("Add to cart")
    }
    // console.log(cartItems)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    if (userId) {
        const saveCartToFirebase = async () => {
            try {
                const cartRef = doc(db, "carts", userId);
                await setDoc(cartRef, { items: cartItems });
                console.log("Cart saved to Firebase");
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
                    console.log("Cart loaded from Firebase");
                } else {
                    console.log("No cart found in Firebase");
                }
            } catch (error) {
                console.error("Error loading cart from Firebase:", error);
            }
        };

        loadCartFromFirebase();
    }
}, [dispatch, userId]);


useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}, [cartItems]);


  useEffect(() => {
    getProductData(product.id);
  }, [id]);

  // //Avarage calculate
  // let totalRating = reviews.reduce((acc, comment) => acc + comment.rating, 0);
  // let averageRating = totalRating / reviews.length;
  // product.rating =averageRating;

// useEffect(() => {
//   const getProductData = async () => {
//     SetLoading(true);
//     try {
//       const productDoc = await getDoc(doc(db, 'products', id));
//       const reviewsCollectionRef = collection(doc(db, 'products', id), 'reviews');
//       const reviewsSnapshot = await getDocs(reviewsCollectionRef);
//       const reviewsData = reviewsSnapshot.docs.map(doc => doc.data());
//       setReviews(reviewsData);

//       if (productDoc.exists()) {
//         const productData = productDoc.data();
        
//         // Calculate average rating
//         let totalRating = reviewsData.reduce((acc, comment) => acc + comment.rating, 0);
//         let averageRating = totalRating / reviewsData.length;

//         // Set product with rating
//         setProduct({ ...productData, rating: averageRating });
//       } else {
//         console.error("No such document!");
//       }
//     } catch (error) {
//       console.error("Error getting document:", error);
//     } finally {
//       SetLoading(false);
//     }
//   };

//   getProductData();
// }, [id]);




  








  // const [usersRevies, setUsersRevies] = useState([1, 2, 3]);
  // const [productImages, setProductImages] = useState([
  //   "https://cdn.pixabay.com/photo/2018/01/09/22/51/roses-3072698_1280.jpg",
  //   "https://cdn.pixabay.com/photo/2017/08/01/08/28/bouquet-2563485_1280.jpg",
  //   "https://cdn.pixabay.com/photo/2016/11/23/00/31/bouquet-1851462_1280.jpg",
  // ]);
  // const [rating] = useState(3.5);
  // const [currentImage, setCurrentImage] = useState(0);

  function changeCurrentImage() {
    // setCurrentImage((prevIndex) => (prevIndex + 1) % productImages.length);
  }

  return <>
  {loading ? (
        <div className="flex justify-center items-center  h-lvh">
          <Vortex
            height={150}
            width={150}
            radius={5}
            colors={[
              "#E8E1DA",
              "#F3C0C7",
              "#AE6B77",
              "#4C1B1B",
              "#6C5A4B",
              "#F3C0C7",
            ]}
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ): ( <>
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col md:flex-row">
        {/* Image Slider */}
        <div className="w-full h-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
          <div
            id="controls-carousel"
            className="relative w-full"
            data-carousel="static"
          >
            {/* Carousel wrapper */}
            <div className="relative  md:h-96 lg:h-100 overflow-hidden rounded-lg">
              {/* Images */}
              <div className="duration-700 ease-in-out">
                <img
                  src={product.image}
                  className="w-full h-full object-cover"
                  alt={product.name || 'product'}
                />
              </div>
            </div>
            {/* Slider controls */}
            <button
              onClick={() => changeCurrentImage()}
              type="button"
              className="absolute top-1/2 left-0 transform -translate-y-1/2 z-30 p-2 bg-gray rounded-full shadow-lg"
              data-carousel-prev
            >
              <svg
                className="w-6 h-6 text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </button>
            <button
              onClick={() => changeCurrentImage()}
              type="button"
              className="absolute top-1/2 right-0 transform -translate-y-1/2 z-30 p-2 bg-gray rounded-full shadow-lg"
              data-carousel-next
            >
              <svg
                className="w-6 h-6 text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>
        {/* Product Details */}
        <div className="w-full md:w-1/2 lg:w-2/3 p-4">
          <div className="text-xl font-bold mb-2 ">
            {product.name}
            <div className="">
              {product.rating > 0 && (
                <StarRatings
                  rating={product.rating || 0} // Provide a default value if rating is undefined
                  starRatedColor="orange"
                  numberOfStars={5}
                  name="rating"
                  starDimension="20px"
                  starSpacing="3px"
                />
              )}
            </div>
          </div>
          <h4 className="text-md text-gray-600 mb-4">
            {product.description}
          </h4>
          <h4><b>Flowers Details :</b></h4>
          <ul>
            <li>Name :<b>{product.type}</b></li>
            <li>Country :<b>{product.country}</b></li>
            <li>Color :<b>{product.colour}</b></li>
            <li>id :<b>{id}</b></li>
          </ul>

          <h4 className="text-lg font-semibold text-yellow-600 mb-4">{product.price} EGP</h4>
          <button  onClick={() => addCart(product ,id)}
            className="bg-deep-burgundy text-white rounded-full py-2 px-4 mt-4 hover:bg-dusty-mauve transition">
            Add to cart
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-8 bg-pale-grayish p-4 rounded-lg">
        <h2 className="font-bold text-2xl mb-4  p-2 rounded-lg">Reviews</h2>

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
  </>)};
</>
}
