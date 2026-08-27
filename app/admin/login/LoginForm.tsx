"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions/auth";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-7 space-y-4 text-left">
      <label htmlFor="password" className="sr-only">
        Staff password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Password"
        className="admin-input py-4 text-center"
      />
      {state.error && (
        <p className="text-center text-sm text-flame" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-ember w-full px-4 py-4 text-sm uppercase tracking-wider"
      >
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
