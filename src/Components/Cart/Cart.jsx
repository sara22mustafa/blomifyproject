import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, deleteFromCart, incrementQuantity } from "../../redux/cartSlice";
import { Trash } from 'lucide-react';
import { db } from "../../firebase/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { setCartItems } from "../../redux/cartSlice";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";


const Cart = () => {
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;


    const handleDelete = (id) => {
    console.log('Dispatching delete action with ID:', id);
    dispatch(deleteFromCart({ id }));
    toast.success('Item removed from cart');
    };

    const handleIncrement = (id) => {
    console.log('Dispatching increment action with ID:', id);
    dispatch(incrementQuantity({ id }));
    };

    const handleDecrement = (id) => {
    console.log('Dispatching decrement action with ID:', id);
    dispatch(decrementQuantity({ id }));
    };


    const cartItemTotal = cartItems.map(item => item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);

    const cartTotal = cartItems.map(item => item.price * item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);
    

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

    return (
        <>
            <div className="container mx-auto px-4 max-w-7xl px-2 lg:px-0">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    </h1>
                    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-8">
                            <h2 id="cart-heading" className="sr-only"></h2>
                            <ul role="list" className="divide-y divide-gray-200">
                                {cartItems.length > 0 ?
                                    <>
                                        {cartItems.map((product, index) => {
                                            const { id, name, price, image, quantity, category } = product;
                                            console.log(product);
                                            return (
                                                <div key={index} className="">
                                                    <li className="flex py-6 sm:py-6">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={image}
                                                                alt={name}
                                                                className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                                                            />
                                                        </div>
                                                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                                <div>
                                                                    <div className="flex justify-between">
                                                                        <h3 className="text-sm font-semibold text-black">
                                                                            {name}
                                                                        </h3>
                                                                    </div>
                                                                    <div className="mt-1 flex text-sm">
                                                                        <p className="text-gray-500">{category}</p>
                                                                    </div>
                                                                    <div className="mt-1 flex items-end">
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            {price} EGP
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <div className="mb-2 flex">
                                                        <div className="min-w-24 flex">
                                                            <button onClick={() => handleDecrement(id)} type="button" className="h-7 w-7">-</button>
                                                            <input
                                                                type="text"
                                                                className="mx-1 h-7 w-9 rounded-md border text-center"
                                                                value={quantity}
                                                                readOnly
                                                            />
                                                            <button onClick={() => handleIncrement(id)} type="button" className="flex h-7 w-7 items-center justify-center">+</button>
                                                        </div>
                                                        <div className="ml-6 flex text-sm">
                                                            <button onClick={() => handleDelete(id)} type="button" className="flex items-center space-x-1 px-2 py-1 pl-0">
                                                                <Trash size={12} className="text-red-500" />
                                                                <span className="text-xs font-medium text-red-500">Remove</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                    :
                                    <h1>Not Found</h1>
                                }
                            </ul>
                        </section>
                        <section
                            aria-labelledby="summary-heading"
                            className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
                        >
                            <h2
                                id="summary-heading"
                                className=" border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
                            >
                            </h2>
                            <div>
                                <dl className=" space-y-1 px-2 py-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">Price ({cartItemTotal} item)</dt>
                                        <dd className="text-sm font-medium text-gray-900"> {cartTotal} EGP</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="flex text-sm text-gray-800">
                                            <span>Delivery Charges</span>
                                        </dt>
                                        <dd className="text-sm font-medium text-green-700">Free</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-y border-dashed py-4 ">
                                        <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                        <dd className="text-base font-medium text-gray-900"> {cartTotal} EGP</dd>
                                    </div>
                                </dl>
                                <div className="px-2 pb-4 font-medium text-green-700">
                                    <div className="flex gap-4 mb-6">
                                        <button
                                            className="w-full px-4 py-3 text-center text-gray-100 bg-deep-burgundy border border-transparent dark:border-gray-700 hover:bg-dusty-mauve transition rounded-xl"
                                        >
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
            <Helmet>
                <title>Your Cart</title>
            </Helmet>
        </>
    );
};

export default Cart;
