// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { register } from "@/lib/api/clientApi";
// import { useAuthStore } from "@/lib/store/authStore";
// import { RegisterCredentials } from "@/types/user";
// import css from "./SignUp.module.css";

// export default function SignUpPage() {
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const setUser = useAuthStore((state) => state.setUser);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);

//     const formData = new FormData(e.currentTarget);

//     const credentials: RegisterCredentials = {
//       email: formData.get("email") as string,
//       password: formData.get("password") as string,
//       // username: formData.get("username") as string,
//     };

//     try {
//       const user = await register(credentials);
//       setUser(user);
//       router.push("/profile");
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.message || "Registration failed");
//       } else {
//         setError("An unexpected error occurred");
//       }
//     }
//   };

//   return (
//     <main className={css.mainContent}>
//       <h1 className={css.formTitle}>Sign up</h1>
//       <form className={css.form} onSubmit={handleSubmit}>
//         {/* <div className={css.formGroup}>
//           <label htmlFor="username">Username</label>
//           <input
//             id="username"
//             type="text"
//             name="username"
//             className={css.input}
//             required
//           />
//         </div> */}

//         <div className={css.formGroup}>
//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             type="email"
//             name="email"
//             className={css.input}
//             required
//           />
//         </div>

//         <div className={css.formGroup}>
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             type="password"
//             name="password"
//             className={css.input}
//             required
//           />
//         </div>

//         <div className={css.actions}>
//           <button type="submit" className={css.submitButton}>
//             Register
//           </button>
//         </div>

//         {error && <p className={css.error}>{error}</p>}
//       </form>
//     </main>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { RegisterCredentials } from "@/types/user";
import css from "./SignUp.module.css";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // const credentials: Omit<RegisterCredentials, "username"> = {
    //   email: formData.get("email") as string,
    //   password: formData.get("password") as string,
    // };
    const credentials: RegisterCredentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const user = await register(credentials as RegisterCredentials);
      setUser(user);
      router.push("/profile");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
