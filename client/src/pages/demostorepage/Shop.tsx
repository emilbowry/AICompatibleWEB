// import React from "react";
// import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../store";

//  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// const CHECKOUT_URL =
//   "https://buy.stripe.com/test_dRm14m7i5b2b0XgdOz0VO00";

// export const CheckoutButton: React.FC = () => {
//   const items = useAppSelector(s => s.cart.items);
//   const disabled = !items.length;

//   const props = disabled
//     ? { onClick: (e: React.MouseEvent) => e.preventDefault() }
//     : { href: CHECKOUT_URL };

//   return (
//     <a
//       {...props}
//       className={`mt-4 inline-block rounded bg-purple-600 px-6 py-3 font-semibold text-white
//                   ${disabled ? "cursor-not-allowed opacity-40" : "hover:brightness-110"}`}
//     >
//       Checkout
//     </a>
//   );
// };
